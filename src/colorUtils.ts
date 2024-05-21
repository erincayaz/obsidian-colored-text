import {STATUS_BAR_COLOR_DARK, STATUS_BAR_COLOR_LIGHT} from "./constants/defaults";

export class ColorUtils {
    private componentToHex(c : number) {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(rgb : string) {
      const substr = rgb.substring(4, rgb.length - 1);
      const rgbArr = substr.split(',');

      let hexStr = "#";
      for (let i = 0; i < 3; i++) {
          hexStr += this.componentToHex(parseInt(rgbArr[i]));
      }

      return hexStr;
    }

    getContrastBorderColor(cellColor: string, curTheme: string): string {
      const statusBarColor = curTheme === 'dark' ? STATUS_BAR_COLOR_DARK : STATUS_BAR_COLOR_LIGHT;
      cellColor = this.rgbToHex(cellColor);

      const rgb1 = [parseInt(cellColor[1] + cellColor[2], 16),
        parseInt(cellColor[3] + cellColor[4], 16),
        parseInt(cellColor[5] + cellColor[6], 16)];

      const rgb2 = [parseInt(statusBarColor[1] + statusBarColor[2], 16),
        parseInt(statusBarColor[3] + statusBarColor[4], 16),
        parseInt(statusBarColor[5] + statusBarColor[6], 16)];

      const avgRgb = [(rgb1[0] + rgb2[0]) / 2, (rgb1[1] + rgb2[1]) / 2, (rgb1[2] + rgb2[2]) / 2];

      const oppositeRgb = [255 - avgRgb[0], 255 - avgRgb[1], 255 - avgRgb[2]];

      const grayScaleValue = (oppositeRgb[0] + oppositeRgb[1] + oppositeRgb[2]) / 3;
      const grayScaleRgb = [grayScaleValue, grayScaleValue, grayScaleValue];

      const oppositeHex = '#' + grayScaleRgb.map(value => {
        const hex = Math.round(value).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');

      return oppositeHex;
    }
}