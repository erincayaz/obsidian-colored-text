export class RGBConverter {
    componentToHex(c : number) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }
      
      rgbToHex(rgb : string) {
        // rgb(0, 0, 0)
        var substr = rgb.substring(4, rgb.length - 1);
        var rgbArr = substr.split(',');

        var hexStr = "#";
        for(let i = 0; i < 3; i++) {
            hexStr += this.componentToHex(parseInt(rgbArr[i]));
        }

        console.log(hexStr);

        return hexStr;
      }    
}