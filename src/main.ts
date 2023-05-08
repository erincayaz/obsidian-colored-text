import { App, Editor, MarkdownView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ColorModal } from "./modal";
import { RGBConverter } from "./rgbConverter";

const DEFAULT_COLOR: string = '#000000';

interface ColorsData {
  colorArr: string[];
}

const DEFAULT_SETTINGS: Partial<ColorsData> = {
  colorArr: ['#000000', '#000000', '#000000', '#000000', '#000000']
};

export default class ColoredFont extends Plugin {
    curColor: string;
    curIndex: number;
    prevIndex: number;
    colorsData: ColorsData;

    async onload() {
        // -------------------- Variables Init -------------------- //
        this.curColor = DEFAULT_COLOR;
        this.curIndex = 0;
        let rgbConverter = new RGBConverter();

        await this.loadColorData();

        // -------------------- Command Implementation -------------------- // 
        // test //
        this.addCommand({
          id: 'add-text',
			    name: 'Add the colored text',
          hotkeys: [],
          editorCallback: (editor: Editor, view: MarkdownView) => {
            let selection = editor.getSelection();
            editor.replaceSelection(`<span style="color:${this.curColor}">${selection}</font>`)

            const curserEnd = editor.getCursor("to");
            editor.setCursor(curserEnd.line, curserEnd.ch + 1);
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
            this.curIndex = this.curIndex == 4 ? 0 : this.curIndex + 1;

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
            this.curIndex = this.curIndex == 0 ? 4 : this.curIndex - 1;

            colorDivs[this.prevIndex].style.borderStyle = 'none';
            colorDivs[this.curIndex].style.borderStyle = 'solid';

            this.curColor = rgbConverter.rgbToHex(colorDivs[this.curIndex].style.backgroundColor);
          }
        })

        // -------------------- Status Bar -------------------- //
        let statusBarColor = this.addStatusBarItem();

        const colorDivs: HTMLDivElement[] = [];
        for(let i = 0; i < 5; i++) {
          let colorText = statusBarColor.createEl('div', { cls: 'status-color' });
          colorText.style.backgroundColor = this.colorsData.colorArr[i];

          colorDivs.push(colorText);
        }

        colorDivs[0].style.borderStyle = 'solid';
    }

    async loadColorData() {
      this.colorsData = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveColorData() {
      await this.saveData(this.colorsData);
    }
}