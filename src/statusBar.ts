import ColoredFont from "./main";
import {setIcon} from "obsidian";

export default class StatusBar {
  private plugin : ColoredFont;
  private coloredTextButton : HTMLElement;
  private colorDivs : HTMLDivElement[] = [];

  constructor(plugin: ColoredFont) {
    this.plugin = plugin;
  }

  addColorCells() {
    for (let i = 0; i < this.plugin.cellCount; i++) {
      const statusBarColor = this.plugin.addStatusBarItem();

      statusBarColor.style.paddingLeft = "0";
      statusBarColor.style.paddingRight = "0";
      statusBarColor.style.order = `${i + 2}`;

      if(this.plugin.hidePlugin) {
        statusBarColor.style.height = "0";
        statusBarColor.style.width = "0";
      }

      statusBarColor.addClasses(["mod-clickable"]);
      statusBarColor.addEventListener("click", this.onClickColorBar(i));
      
      const colorIcon = statusBarColor.createDiv(
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
      this.colorDivs.push(colorIcon);
    }

    if(!this.plugin.hidePlugin)
      this.colorDivs[0].style.borderStyle = 'solid';
  }

  private onClickColorBar = (index: number) => () => {
    if(this.plugin.curIndex === index) {
      this.plugin.openColorModal();
    }
    else {
      this.plugin.selectColor(index); 
    }
  }

  addColoredTextMode() {
    const item = this.plugin.addStatusBarItem();
    item.style.order = "1";
    item.ariaLabel = "Colored Text";

    this.coloredTextButton = item;

    item.addClass("mod-clickable");
    item.addEventListener("click", this.onClickColoredText());

    setIcon(item, "highlighter");

    if(this.plugin.hidePlugin) {
      item.style.height = "0";
      item.style.width = "0";
    }
  }

  clickColoredText() {
    this.plugin.highlightMode = !this.plugin.highlightMode;

    if(!this.plugin.hidePlugin)
      this.coloredTextButton.style.backgroundColor = this.plugin.highlightMode ? 'rgba(220, 220, 220, 0.3)' : 'rgba(220, 220, 220, 0)';
  }

  changeCurrentIndex() {
    this.colorDivs[this.plugin.prevIndex].style.borderStyle = 'none';
    this.colorDivs[this.plugin.curIndex].style.borderStyle = 'solid';
  }

  changeCellColor(modalResult: string) {
    this.colorDivs[this.plugin.curIndex].style.backgroundColor = modalResult;
  }

  getCurCellColor() {
    return this.colorDivs[this.plugin.curIndex].style.backgroundColor;
  }

  private onClickColoredText = () => () => {
    this.clickColoredText();
  }
}
 