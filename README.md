
## A cool plugin to generate styles and palettes using any image

Thank you for checking out this plugin.

This plugin allows you to generate a palette and css styles from any image.

You can select the number of colors you want in your palette, and the plugin will generate a palette of that many colors.

# Changelog

## [1.1.0] - 2024-09-05

### Added

- New feature: Palettes are now generated below existing elements on the canvas
- Improved positioning logic to prevent overlapping palettes

### Changed

- Updated `applyColors` function in `main.ts` to calculate the lowest Y-coordinate of existing elements
- Modified palette frame positioning to be placed below the lowest existing element with padding

### Fixed

- Issue where new palettes would overlap with existing ones on the canvas

### Unchanged

- All other files remain the same as in the previous version

## [1.0.0] - 2024-09-05

### Added

- Initial release of the Create a Palette plugin
- Feature to generate color palettes from uploaded images
- Ability to apply generated colors to the Figma canvas
- Option to add generated colors to Figma Styles
- User interface with tabs for different palette generation methods (Image, Website, Random)

Built using [use-color-thief](https://github.com/csandman/use-color-thief) , Clause 3.5 Sonnet and [Cursor AI](https://cursor.sh/)