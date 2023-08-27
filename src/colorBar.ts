import ColoredFont from "./main";

export default class ColorBar {
  private plugin : ColoredFont;

  constructor(plugin: ColoredFont) {
    this.plugin = plugin;
  }

  addColorBar() {
    for (let i = 0; i < this.plugin.cellCount; i++) {
      let statusBarColor = this.plugin.addStatusBarItem();

      statusBarColor.style.paddingLeft = "0";
      statusBarColor.style.paddingRight = "0";
      statusBarColor.style.order = `${i + 1}`;

      statusBarColor.addClasses(["mod-clickable"]);
      statusBarColor.addEventListener("click", this.onClick(i));
      
      let colorIcon = statusBarColor.createDiv(
        { 
          cls: 'status-color',
        }
      );

      // TODO: Find a better way to do this
      if (i > this.plugin.colorsData.colorArr.length - 1) {
        colorIcon.style.backgroundColor = "#000000";
      }
      else {
        colorIcon.style.backgroundColor = this.plugin.colorsData.colorArr[i];
      }
      this.plugin.colorDivs.push(colorIcon);
    }
    
    this.plugin.colorDivs[0].style.borderStyle = 'solid';
  }

  onClick = (index: number) => (e: Event) => {
    if(this.plugin.curIndex == index) {
      this.plugin.openColorModal();
    }
    else {
      this.plugin.selectColor(index); 
    }
  }
}
 