# Numero — Figma Plugin

Number selected layers based on their position (left→right, top→bottom, etc.)

## Install

1. Clone this repo
2. Figma → Plugins → Development → Import plugin from manifest
3. Select `manifest.json`

## Usage

1. Select layers in Figma
2. Run the plugin
3. Pick direction + options
4. Apply

## Options

| Option    | Description                     |
|-----------|---------------------------------|
| Direction | L→R, R→L, T→B, B→T              |
| Start at  | First number (default: 1)       |
| Padding   | Zero-pad (1 = "1", 2 = "01")    |
| Prefix    | Before number (e.g. "step-")    |
| Suffix    | After number (e.g. "_final")    |

## License

MIT
