# Numero — Figma Plugin

Rename and number selected layers based on their position, with smart row/column detection and optional page number overlays.

## Features

- **Smart ordering** — Lines, Columns, or Auto mode that detects your layout automatically
- **Page number labels** — Visible overlays pinned to any corner of each frame with full styling control
- **Naming options** — Start number, zero-padding, prefix, suffix

## Install

1. Download the [latest release](https://github.com/LouisAvisse/numero/releases/latest)
2. Unzip the files
3. In Figma → Plugins → Development → Import plugin from manifest
4. Select `manifest.json`

## Usage

1. Select frames in Figma
2. Run the plugin
3. Pick an ordering mode and set naming options
4. Check **Page Numbers** to add visible labels inside frames
5. Click **Apply**

## Options

| Option    | Description                      |
|-----------|----------------------------------|
| Order     | Lines, Columns, or Auto          |
| Start at  | First number (default: 1)        |
| Padding   | Zero-pad (1 = "1", 2 = "01")    |
| Prefix    | Before number (e.g. "Slide-")    |
| Suffix    | After number (e.g. "_final")     |

## Page Number Options

| Option    | Default      | Description                                          |
|-----------|--------------|------------------------------------------------------|
| Position  | Bottom Right | Any corner — pick on the visual position map         |
| Font size | 14px         | Size of the label text                               |
| Color     | #FFFFFF      | Full color picker with hex input                     |
| Margin    | 24px         | Distance from the frame edges                        |
| Format    | `{n}`        | Template — use `{n}` for number, `{total}` for count |
| Opacity   | 100%         | Label transparency                                   |

Labels are constraint-pinned to the chosen corner, survive frame resizes, and work inside auto-layout frames. Use the **Clear** button to remove all existing labels.

## License

MIT
