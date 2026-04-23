# Numero — Figma Plugin

Rename and number selected layers based on their position, with smart row detection and optional page number overlays.

## Features

- **Smart sorting** — Automatically detects rows and columns. If you have 5 frames on row 1 and 3 on row 2, they become 1–5 and 6–8.
- **4 directions** — Left→Right, Right→Left, Top→Bottom, Bottom→Top
- **Page number labels** — Add visible page numbers inside each frame, positioned at bottom-left or bottom-right with full styling control
- **Naming options** — Start number, zero-padding, prefix, suffix

## Install

1. Download the [latest release](https://github.com/LouisAvisse/numero/releases/latest)
2. Unzip the files
3. In Figma → Plugins → Development → Import plugin from manifest
4. Select `manifest.json`

## Usage

1. Select frames in Figma
2. Run the plugin
3. Pick a direction and set naming options
4. Toggle **Page Numbers** to add visible labels inside frames
5. Click **Apply Changes**

## Naming Options

| Option    | Description                     |
|-----------|---------------------------------|
| Direction | L→R, R→L, T→B, B→T             |
| Start at  | First number (default: 1)       |
| Padding   | Zero-pad (1 = "1", 2 = "01")   |
| Prefix    | Before number (e.g. "Slide-")   |
| Suffix    | After number (e.g. "_final")    |

## Page Number Options

| Option    | Default    | Description                                          |
|-----------|------------|------------------------------------------------------|
| Position  | Bottom Right | Bottom-left or bottom-right of the frame           |
| Font size | 14px       | Size of the label text                               |
| Color     | #FFFFFF    | Full color picker, hex input, and 7 preset swatches      |
| Margin    | 24px       | Distance from the frame edges                        |
| Format    | `{n}`      | Template — use `{n}` for number, `{total}` for count |
| Opacity   | 100%       | Label transparency                                   |

Labels are constraint-pinned to the chosen corner, survive frame resizes, and work inside auto-layout frames. Use the **Clear** button to remove all existing labels.

## License

MIT
