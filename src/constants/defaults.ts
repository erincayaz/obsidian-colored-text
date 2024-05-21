import { ColorsData } from "../types/plugin";

export const MAX_CELL_COUNT = 20;
export const DEFAULT_COLOR = '#000000';
export const DEFAULT_SETTINGS: Readonly<ColorsData> = {
  favoriteColors: [
    "#c00000",
    "#ff0000",
    "#ffc000",
    "#ffff00",
    "#92d050",
    "#00b050",
    "#00b0f0",
    "#0070c0",
    "#002060",
    "#7030a0"
  ],
  colorArr: Array(5).fill(DEFAULT_COLOR),
  colorCellCount: "5",
  hidePlugin: false
};

export const STATUS_BAR_COLOR_LIGHT = '#f6f6f6';
export const STATUS_BAR_COLOR_DARK = '#262626';

export const COLORED_TEXT_MODE_HIGHLIGHTED_LIGHT = 'rgba(180, 180, 180, 0.3)';
export const COLORED_TEXT_MODE_HIGHLIGHTED_DARK = 'rgba(220, 220, 220, 0.3)';

export enum IndexMode {
  Forward,
  Backwards,
  Select
}

export enum ColorMode {
  Normal,
  ColoredText
}