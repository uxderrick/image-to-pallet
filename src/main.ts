import { on, showUI } from '@create-figma-plugin/utilities'
import { ApplyColorsHandler } from './types'

export default function () {
  function applyColors(palette: string[]) {
    console.log('APPLY_COLORS function started', palette);

    try {
      // Create a parent frame
      const parentFrame = figma.createFrame();
      console.log('Parent frame created');

      parentFrame.name = 'Color Palette';
      parentFrame.layoutMode = 'HORIZONTAL';
      parentFrame.counterAxisSizingMode = 'AUTO';
      parentFrame.horizontalPadding = 16;
      parentFrame.verticalPadding = 16;
      parentFrame.itemSpacing = 8;

      const colorSize = 100; // Set a fixed size for all color frames

      palette.forEach((hexColor, index) => {
        console.log(`Processing color ${index + 1}: ${hexColor}`);

        // Create a frame for each color
        const colorFrame = figma.createFrame();

        colorFrame.name = `Color ${index + 1}`;
        colorFrame.resize(colorSize, colorSize); // Use the fixed size

        // Set the fill of the frame to the color from the palette
        const rgbColor = hexToRgb(hexColor);
        colorFrame.fills = [{type: 'SOLID', color: rgbColor}];

        // Add the color frame to the parent frame
        parentFrame.appendChild(colorFrame);
      });

      // Add the parent frame to the current page
      figma.currentPage.appendChild(parentFrame);

      // Select the parent frame and zoom to fit
      figma.currentPage.selection = [parentFrame];
      figma.viewport.scrollAndZoomIntoView([parentFrame]);

      figma.notify(`Palette with ${palette.length} colors generated on canvas!`);
    } catch (error) {
      console.error('Error in APPLY_COLORS function:', error);
      figma.notify('Error generating palette. Check plugin console for details.');
    }
  }

  function addToStyles(palette: string[]) {
    console.log('ADD_TO_STYLES function started', palette)

    try {
      palette.forEach((hexColor, index) => {
        const styleName = `Color ${index + 1}`
        const rgbColor = hexToRgb(hexColor)

        const paintStyle = figma.createPaintStyle()
        paintStyle.name = styleName
        paintStyle.paints = [{type: 'SOLID', color: rgbColor}]
      })

      figma.notify(`${palette.length} color styles added to the document!`)
    } catch (error) {
      console.error('Error in ADD_TO_STYLES function:', error)
      figma.notify('Error adding color styles. Check plugin console for details.')
    }
  }

  // Show UI with initial size, but allow it to be resized
  showUI({
    width: 400,
    height: 400,
    themeColors: true
  }, { visible: true });

  // Listen for messages from the UI
  figma.ui.onmessage = (msg) => {
    console.log('Received message:', msg);
    if (msg.type === 'APPLY_COLORS') {
      applyColors(msg.palette);
    } else if (msg.type === 'ADD_TO_STYLES') {
      addToStyles(msg.palette);
    } else if (msg.type === 'resize') {
      figma.ui.resize(440, msg.height);
    }
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r: r / 255, g: g / 255, b: b / 255 };
}

function getContrastColor(color: { r: number; g: number; b: number; }): RGB {
  throw new Error('Function not implemented.');
}

