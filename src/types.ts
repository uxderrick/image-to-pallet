import { EventHandler } from '@create-figma-plugin/utilities'

export interface InsertCodeHandler extends EventHandler {
  name: 'INSERT_CODE'
  handler: (code: string) => void
}

export interface ApplyColorsHandler {
  name: 'APPLY_COLORS' | 'ADD_TO_STYLES'
  handler: (palette: string[]) => void
}

export interface AddToStylesHandler {
  name: 'ADD_TO_STYLES'
  handler: (palette: string[]) => void
}

export type Handler = InsertCodeHandler | ApplyColorsHandler | AddToStylesHandler | AddToStylesHandler