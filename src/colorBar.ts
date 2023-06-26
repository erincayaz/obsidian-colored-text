import ColoredFont from "./main";

export default class ColorBar {
  private plugin : ColoredFont;

  constructor(plugin: ColoredFont) {
    this.plugin = plugin;
  }

  addColorBar() {
    let statusBarColor = this.plugin.addStatusBarItem();
    statusBarColor.addClass("mod-clickable")
     
    for (let i = 0; i < this.plugin.cellCount; i++) {
      let colorText = statusBarColor.createDiv(
        { 
          cls: 'status-color',
          attr: {id: `saved-color-${i}`}
        }
      );
      colorText.addEventListener("click", this.onClick());

      // TODO: Find a better way to do this
      if (i > this.plugin.colorsData.colorArr.length - 1) {
        colorText.style.backgroundColor = "#000000";
      }
      else {
        colorText.style.backgroundColor = this.plugin.colorsData.colorArr[i];
      }
      this.plugin.colorDivs.push(colorText);
    }
    
    this.plugin.colorDivs[0].style.borderStyle = 'solid';
  }

  onClick() {
    let plugin = this.plugin;

    return function(this: HTMLDivElement, event: Event) {
      let newIndex = Number(this.id.replace(/^\D+/g, ''));
      plugin.selectColor(newIndex);
    };
  }
}
 