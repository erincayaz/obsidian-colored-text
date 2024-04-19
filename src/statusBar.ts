import ColoredFont from "./main";
import {setIcon} from "obsidian";
import {IndexMode, MAX_CELL_COUNT} from "./constants/defaults";

export default class StatusBar {
  private coloredTextButton : HTMLElement;
  private colorDivs : HTMLDivElement[] = [];

  private readonly cellCount : number;
  private readonly hidePlugin : boolean;

  public curIndex : number;
  private prevIndex : number;
  public highlightMode : boolean;

  constructor(plugin: ColoredFont) {
    this.curIndex = 0;
    this.highlightMode = false;

    this.cellCount = +plugin.colorsData.colorCellCount > MAX_CELL_COUNT ?
      MAX_CELL_COUNT : +plugin.colorsData.colorCellCount;
    this.hidePlugin = plugin.colorsData.hidePlugin;

    this.addColorCells(plugin);
    this.addColoredTextMode(plugin);
  }

  addColorCells(plugin: ColoredFont) {
    const onClickColorBar = (index: number) => () => {
      if(this.curIndex === index) {
        plugin.openColorModal();
      }
      else {
        this.changeCurrentIndex(IndexMode.Select, index);
      }
    }

    for (let i = 0; i < this.cellCount; i++) {
      const statusBarColor = plugin.addStatusBarItem();

      statusBarColor.style.paddingLeft = "0";
      statusBarColor.style.paddingRight = "0";
      statusBarColor.style.order = `${i + 2}`;

      if(this.hidePlugin) {
        statusBarColor.style.height = "0";
        statusBarColor.style.width = "0";
      }

      statusBarColor.addClasses(["mod-clickable"]);
      statusBarColor.addEventListener("click", onClickColorBar(i));
      
      const colorIcon = statusBarColor.createDiv(
        { 
          cls: 'status-color',
        }
      );

      // TODO: Find a better way to do this
      if (i > plugin.colorsData.colorArr.length - 1) {
        colorIcon.style.backgroundColor = "#000000";
      }
      else {
        colorIcon.style.backgroundColor = plugin.colorsData.colorArr[i];
      }
      this.colorDivs.push(colorIcon);
    }

    if(!this.hidePlugin)
      this.colorDivs[0].style.borderStyle = 'solid';
  }

  addColoredTextMode(plugin: ColoredFont) {
    const item = plugin.addStatusBarItem();
    item.style.order = "1";
    item.ariaLabel = "Colored Text";

    this.coloredTextButton = item;

    item.addClass("mod-clickable");
    item.addEventListener("click", this.onClickColoredText());

    setIcon(item, "highlighter");

    if(this.hidePlugin) {
      item.style.height = "0";
      item.style.width = "0";
    }
  }

  clickColoredText() {
    this.highlightMode = !this.highlightMode;

    if(!this.hidePlugin)
      this.coloredTextButton.style.backgroundColor = this.highlightMode ? 'rgba(220, 220, 220, 0.3)' : 'rgba(220, 220, 220, 0)';
  }

  changeCurrentIndex(indexMode: IndexMode, newIndex = 0) {
    this.prevIndex = this.curIndex

    if(indexMode === IndexMode.Select) {
      this.curIndex = newIndex;
    } else if(indexMode === IndexMode.Forward) {
      this.curIndex = this.curIndex + 1 >= this.cellCount ? 0 : this.curIndex + 1;
    } else {
      this.curIndex = this.curIndex - 1 < 0 ? this.cellCount - 1 : this.curIndex - 1;
    }

    if(!this.hidePlugin) {
      this.colorDivs[this.prevIndex].style.borderStyle = 'none';
      this.colorDivs[this.curIndex].style.borderStyle = 'solid';
    }
  }

  changeCellColor(modalResult: string) {
    this.colorDivs[this.curIndex].style.backgroundColor = modalResult;
  }

  getCurCellColor() {
    return this.colorDivs[this.curIndex].style.backgroundColor;
  }

  private onClickColoredText = () => () => {
    this.clickColoredText();
  }
}
 