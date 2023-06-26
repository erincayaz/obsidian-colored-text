import { App, Editor, MarkdownView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
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

    async onload() {
        // -------------------- Variables Init -------------------- //
        this.curColor = DEFAULT_COLOR;
        this.curIndex = 0;
        let rgbConverter = new RGBConverter();

        await this.loadColorData();
        this.cellCount = +this.colorsData.colorCellCount > MAX_CELL_COUNT ? MAX_CELL_COUNT : +this.colorsData.colorCellCount;
        this.addSettingTab(new SettingsTab(this.app, this));

        this.registerEvent(
          this.app.workspace.on("editor-menu", this.handleColorChangeInContextMenu)
        );

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
              colorDivs[this.curIndex].style.backgroundColor = result;
              
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
          callback: () => {
            this.prevIndex = this.curIndex;
            this.curIndex = this.curIndex == (this.cellCount - 1) ? 0 : this.curIndex + 1;

            colorDivs[this.prevIndex].style.borderStyle = 'none';
            colorDivs[this.curIndex].style.borderStyle = 'solid';

            this.curColor = rgbConverter.rgbToHex(colorDivs[this.curIndex].style.backgroundColor);
          }
        })

        this.addCommand({
          id: 'change-color-backwards',
          name: 'Change the Color Backwards',
          hotkeys: [],
          callback: () => {
            this.prevIndex = this.curIndex;
            this.curIndex = this.curIndex == 0 ? (this.cellCount - 1) : this.curIndex - 1;

            colorDivs[this.prevIndex].style.borderStyle = 'none';
            colorDivs[this.curIndex].style.borderStyle = 'solid';

            this.curColor = rgbConverter.rgbToHex(colorDivs[this.curIndex].style.backgroundColor);
          }
        })

        // -------------------- Status Bar -------------------- //
        let statusBarColor = this.addStatusBarItem();

        const colorDivs: HTMLDivElement[] = [];
        for(let i = 0; i < this.cellCount; i++) {
          let colorText = statusBarColor.createEl('div', { cls: 'status-color' });

          // TODO: Find a better way to do this
          if(i > this.colorsData.colorArr.length - 1)
            colorText.style.backgroundColor = "#000000";
          else 
            colorText.style.backgroundColor = this.colorsData.colorArr[i];

          colorDivs.push(colorText);
        }

        colorDivs[0].style.borderStyle = 'solid';
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