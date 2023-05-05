export class RGBConverter {
    componentToHex(c : number) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      
      rgbToHex(rgb : string) {
        // rgb(0, 0, 0)
        let substr = rgb.substring(4, rgb.length - 1);
        let rgbArr = substr.split(',');

        let hexStr = "#";
        for(let i = 0; i < 3; i++) {
            hexStr += this.componentToHex(parseInt(rgbArr[i]));
        }

        return hexStr;
      }    
}