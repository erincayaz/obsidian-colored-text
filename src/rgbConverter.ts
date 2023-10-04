export class RgbConverter {
    componentToHex(c : number) {
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
}