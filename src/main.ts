import { Menu, Editor, MarkdownView, Plugin } from 'obsidian';
import ColorBar from './colorBar';
import { ColorModal } from "./modal";
import { RGBConverter } from "./rgbConverter";
import { SettingsTab } from './settings';
import contextMenu from './contextMenu';

const DEFAULT_COLOR: string = '#000000';
const MAX_CELL_COUNT: number = 20;

interface ColorsData {
  colorArr: string[];
  colorCellCount: string;
}

const DEFAULT_SETTINGS: Partial<ColorsData> = {
  colorArr: ['#000000', '#000000', '#000000', '#000000', '#000000'],
  colorCellCount: "5"
};

export default class ColoredFont extends Plugin {
    curColor: string;
    curIndex: number;
    prevIndex: number;
    colorsData: ColorsData;
    cellCount: number;
    colorDivs: HTMLDivElement[] = [];

    colorBar: ColorBar;

    async onload() {
        // -------------------- Variables Init -------------------- //
        this.curColor = DEFAULT_COLOR;
        this.curIndex = 0;

        await this.loadColorData();
        
        this.cellCount = +this.colorsData.colorCellCount > MAX_CELL_COUNT ? MAX_CELL_COUNT : +this.colorsData.colorCellCount;
        this.addSettingTab(new SettingsTab(this.app, this));

        this.registerEvent(
          this.app.workspace.on("editor-menu", this.handleColorChangeInContextMenu)
        );

        this.colorBar = new ColorBar(this);
        this.colorBar.addColorBar();
        
        // -------------------- Command Implementation -------------------- // 
        this.addCommand({
          id: 'add-text',
			    name: 'Add the colored text',
          hotkeys: [],
          editorCallback: (editor: Editor, view: MarkdownView) => {
            let selection = editor.getSelection();
            editor.replaceSelection(`<span style="color:${this.curColor}">${selection}</span>`);

            const cursorEnd = editor.getCursor("to");
            cursorEnd.ch -= 7;
            editor.setCursor(cursorEnd);
          }
        });
        
        this.addCommand({
          id: 'get-color-input',
          name: 'Get Color Input',
          hotkeys: [],
          callback: () => {
            new ColorModal(this.app, this.curColor, (result) => {
              this.curColor = result;
              this.colorDivs[this.curIndex].style.backgroundColor = result;
              
              // Save Color
              this.colorsData.colorArr[this.curIndex] = result;
              this.saveColorData();
            }).open();
          },
        })

        // --------------------  Change Color -------------------- //
        this.addCommand({
          id: 'change-color-forward',
          name: 'Change the Color Forward',
          hotkeys: [],
          callback: () => this.selectColor(this.curIndex == (this.cellCount - 1) ? 0 : this.curIndex + 1)
        })

        this.addCommand({
          id: 'change-color-backwards',
          name: 'Change the Color Backwards',
          hotkeys: [],
          callback: () => this.selectColor(this.curIndex == 0 ? (this.cellCount - 1) : this.curIndex - 1)
        })
    }

    selectColor(newIndex: number) {
      let rgbConverter = new RGBConverter();
      
      this.prevIndex = this.curIndex;
      this.curIndex = newIndex;

      this.colorDivs[this.prevIndex].style.borderStyle = 'none';
      this.colorDivs[this.curIndex].style.borderStyle = 'solid';

      this.curColor = rgbConverter.rgbToHex(this.colorDivs[this.curIndex].style.backgroundColor);
    }

    handleColorChangeInContextMenu = (
      menu: Menu,
      editor: Editor,
    ): void => {
      contextMenu(app, menu, editor, this, this.curColor);
    }

    async loadColorData() {
      this.colorsData = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
      this.curColor = this.colorsData.colorArr[0];
    }

    async saveColorData() {
      await this.saveData(this.colorsData);
    }
}