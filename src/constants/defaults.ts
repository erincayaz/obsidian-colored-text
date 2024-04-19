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
export enum IndexMode {
  Forward,
  Backwards,
  Select
}

export enum ColorMode {
  Normal,
  Highlight
}