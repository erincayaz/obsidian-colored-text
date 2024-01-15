import ColoredFont from "./main";
import {setIcon} from "obsidian";

export default class StatusBar {
  private plugin : ColoredFont;

  private highlightButton : HTMLElement;

  constructor(plugin: ColoredFont) {
    this.plugin = plugin;
  }

  // region Color Cells
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
      this.plugin.colorDivs.push(colorIcon);
    }

    if(!this.plugin.hidePlugin)
      this.plugin.colorDivs[0].style.borderStyle = 'solid';
  }

  private onClickColorBar = (index: number) => () => {
    if(this.plugin.curIndex === index) {
      this.plugin.openColorModal();
    }
    else {
      this.plugin.selectColor(index); 
    }
  }
  // endregion

  // region Highlight Mode
  addHighlightMode() {
    const item = this.plugin.addStatusBarItem();
    item.style.order = "1";
    item.ariaLabel = "Highlight Mode";

    this.highlightButton = item;

    item.addClass("mod-clickable");
    item.addEventListener("click", this.onClickHighlight());

    setIcon(item, "highlighter");

    if(this.plugin.hidePlugin) {
      item.style.height = "0";
      item.style.width = "0";
    }
  }

  clickHighlight() {
    this.plugin.highlightMode = !this.plugin.highlightMode;

    if(!this.plugin.hidePlugin)
      this.highlightButton.style.backgroundColor = this.plugin.highlightMode ? 'rgba(220, 220, 220, 0.3)' : 'rgba(220, 220, 220, 0)';
  }

  private onClickHighlight = () => () => {
    this.clickHighlight();
  }
  // endregion
}
 