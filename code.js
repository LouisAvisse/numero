// Numero – Figma Layer Numbering Plugin

figma.showUI(__html__, { width: 320, height: 580 });

// ── Row / Column Grouping ──────────────────────────────

function groupIntoRows(layers) {
  if (!layers.length) return [];
  const sorted = [...layers].sort((a, b) => a.y - b.y);
  const rows = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const ref = rows[rows.length - 1][0];
    if (Math.abs(curr.y - ref.y) <= ref.height * 0.5) {
      rows[rows.length - 1].push(curr);
    } else {
      rows.push([curr]);
    }
  }
  return rows;
}

function groupIntoCols(layers) {
  if (!layers.length) return [];
  const sorted = [...layers].sort((a, b) => a.x - b.x);
  const cols = [[sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const ref = cols[cols.length - 1][0];
    if (Math.abs(curr.x - ref.x) <= ref.width * 0.5) {
      cols[cols.length - 1].push(curr);
    } else {
      cols.push([curr]);
    }
  }
  return cols;
}

function sortLayers(layers, direction) {
  switch (direction) {
    case 'left-right': {
      const rows = groupIntoRows(layers);
      rows.forEach(r => r.sort((a, b) => a.x - b.x));
      return rows.flat();
    }
    case 'right-left': {
      const rows = groupIntoRows(layers);
      rows.forEach(r => r.sort((a, b) => b.x - a.x));
      return rows.flat();
    }
    case 'top-bottom': {
      const cols = groupIntoCols(layers);
      cols.forEach(c => c.sort((a, b) => a.y - b.y));
      return cols.flat();
    }
    case 'bottom-top': {
      const cols = groupIntoCols(layers);
      cols.forEach(c => c.sort((a, b) => b.y - a.y));
      return cols.flat();
    }
    case 'auto': {
      if (layers.length <= 1) return layers;
      const xs = layers.map(l => l.x);
      const ys = layers.map(l => l.y);
      const xRange = Math.max(...xs) - Math.min(...xs);
      const yRange = Math.max(...ys) - Math.min(...ys);
      if (xRange >= yRange) {
        const rows = groupIntoRows(layers);
        rows.forEach(r => r.sort((a, b) => a.x - b.x));
        return rows.flat();
      } else {
        const cols = groupIntoCols(layers);
        cols.forEach(c => c.sort((a, b) => a.y - b.y));
        return cols.flat();
      }
    }
    default:
      return layers;
  }
}

// ── Page Label Helpers ─────────────────────────────────

var PAGE_TAG = '__numero_page__';

function removePageLabels(node) {
  if (!('children' in node)) return 0;
  var hits = node.children.filter(function(c) { return c.name === PAGE_TAG; });
  hits.forEach(function(c) { c.remove(); });
  return hits.length;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(function(c) { return c + c; }).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
  };
}

// ── Message Handler ────────────────────────────────────

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'resize') {
    figma.ui.resize(320, msg.height);
    return;
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'remove-page-numbers') {
    const sel = figma.currentPage.selection;
    if (!sel.length) {
      figma.ui.postMessage({ type: 'error', message: 'Select layers first' });
      return;
    }
    let count = 0;
    sel.forEach(n => { count += removePageLabels(n); });
    figma.ui.postMessage({
      type: count ? 'success' : 'error',
      message: count ? count + ' page label' + (count > 1 ? 's' : '') + ' removed' : 'No page labels found',
    });
    return;
  }

  if (msg.type === 'number-layers') {
    const selection = figma.currentPage.selection;
    if (!selection.length) {
      figma.ui.postMessage({ type: 'error', message: 'Select layers first' });
      return;
    }

    const layers = sortLayers([...selection], msg.direction);
    const startAt = typeof msg.startAt === 'number' && !isNaN(msg.startAt) ? msg.startAt : 1;
    const prefix = msg.prefix || '';
    const suffix = msg.suffix || '';
    const padding = msg.padding || 1;

    layers.forEach((layer, i) => {
      const num = (startAt + i).toString().padStart(padding, '0');
      layer.name = prefix + num + suffix;
    });

    if (msg.pageNumbers && msg.pageNumbers.enabled) {
      const pn = msg.pageNumbers;

      let fontStyle = 'Regular';
      await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
      for (const style of ['Semi Bold', 'SemiBold', 'Medium']) {
        try {
          await figma.loadFontAsync({ family: 'Inter', style: style });
          fontStyle = style;
          break;
        } catch (e) { /* try next */ }
      }

      const total = layers.length;
      let labeled = 0;

      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        if (!('children' in layer)) continue;

        removePageLabels(layer);

        const currentNum = (startAt + i).toString().padStart(padding, '0');
        const totalStr = total.toString();

        const text = (pn.format || '{n}')
          .replace(/\{n\}/g, currentNum)
          .replace(/\{total\}/g, totalStr);

        const node = figma.createText();
        node.name = PAGE_TAG;
        node.fontName = { family: 'Inter', style: fontStyle };
        node.characters = text;
        node.fontSize = pn.fontSize || 14;
        node.fills = [{ type: 'SOLID', color: hexToRgb(pn.color || '#FFFFFF') }];
        node.opacity = (typeof pn.opacity === 'number' && !isNaN(pn.opacity) ? pn.opacity : 100) / 100;

        layer.appendChild(node);

        if (layer.layoutMode && layer.layoutMode !== 'NONE') {
          node.layoutPositioning = 'ABSOLUTE';
        }

        const margin = typeof pn.margin === 'number' && !isNaN(pn.margin) ? pn.margin : 24;

        if (pn.position === 'top-left') {
          node.x = margin;
          node.y = margin;
          node.constraints = { horizontal: 'MIN', vertical: 'MIN' };
        } else if (pn.position === 'top-right') {
          node.x = layer.width - node.width - margin;
          node.y = margin;
          node.constraints = { horizontal: 'MAX', vertical: 'MIN' };
        } else if (pn.position === 'bottom-left') {
          node.x = margin;
          node.y = layer.height - node.height - margin;
          node.constraints = { horizontal: 'MIN', vertical: 'MAX' };
        } else {
          node.x = layer.width - node.width - margin;
          node.y = layer.height - node.height - margin;
          node.constraints = { horizontal: 'MAX', vertical: 'MAX' };
        }

        labeled++;
      }

      const result = labeled === layers.length
        ? layers.length + ' layers numbered & labeled'
        : layers.length + ' numbered · ' + labeled + ' labeled';
      figma.ui.postMessage({ type: 'success', message: result });
    } else {
      figma.ui.postMessage({
        type: 'success',
        message: layers.length + ' layers numbered',
      });
    }
  }
};

// ── Selection Tracking ─────────────────────────────────

function sendSelection() {
  figma.ui.postMessage({
    type: 'selection',
    count: figma.currentPage.selection.length,
  });
}

figma.on('selectionchange', sendSelection);
sendSelection();
