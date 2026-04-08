// Layer Numbering Plugin - Main Logic

figma.showUI(__html__, { width: 300, height: 420 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'number-layers') {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.ui.postMessage({ type: 'error', message: 'Select layers first' });
      return;
    }

    // Clone selection to sort without mutating
    const layers = [...selection];
    
    // Sort based on direction
    switch (msg.direction) {
      case 'left-right':
        layers.sort((a, b) => a.x - b.x);
        break;
      case 'right-left':
        layers.sort((a, b) => b.x - a.x);
        break;
      case 'top-bottom':
        layers.sort((a, b) => a.y - b.y);
        break;
      case 'bottom-top':
        layers.sort((a, b) => b.y - a.y);
        break;
    }

    // Rename layers
    const startNum = msg.startAt || 1;
    const prefix = msg.prefix || '';
    const suffix = msg.suffix || '';
    const padding = msg.padding || 1;

    layers.forEach((layer, index) => {
      const num = (startNum + index).toString().padStart(padding, '0');
      layer.name = `${prefix}${num}${suffix}`;
    });

    figma.ui.postMessage({ 
      type: 'success', 
      message: `${layers.length} layers numbered` 
    });
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Update selection count in UI
figma.on('selectionchange', () => {
  figma.ui.postMessage({ 
    type: 'selection', 
    count: figma.currentPage.selection.length 
  });
});

// Initial selection count
figma.ui.postMessage({ 
  type: 'selection', 
  count: figma.currentPage.selection.length 
});
