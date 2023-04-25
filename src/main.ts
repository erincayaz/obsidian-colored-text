import { App, Editor, MarkdownView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ColorModal } from "./modal";
import { RGBConverter } from "./rgbConverter";

const DEFAULT_COLOR: string = '#000000';

export default class ColoredFont extends Plugin {
    curColor: string;
    curIndex: number;
    prevIndex: number;

    async onload() {
        this.curColor = DEFAULT_COLOR;
        this.curIndex = 0;
        let rgbConverter = new RGBConverter();

        // -------------------- Command Implementation -------------------- // 
        this.addCommand({
          id: 'add-text',
			    name: 'Add the colored text',
          hotkeys: [{ modifiers: ["Mod", "Shift"], key: "x" }],
          editorCallback: (editor: Editor, view: MarkdownView) => {
            var selection = editor.getSelection();
            editor.replaceSelection(`<font style="color:${this.curColor}">${selection}</font>`)

            const curserEnd = editor.getCursor("to");
            editor.setCursor(curserEnd.line, curserEnd.ch + 1);
          }
        });
        
        this.addCommand({
          id: 'get-color-input',
          name: 'Get Color Input',
          hotkeys: [{modifiers: ["Mod", "Shift"], key: "b"}],
          callback: () => {
            new ColorModal(this.app, this.curColor, (result) => {
              this.curColor = result;
              colorDivs[this.curIndex].style.backgroundColor = result;
            }).open();
          },
        })

        // --------------------  Change Color -------------------- //
        this.addCommand({
          id: 'change-color-forward',
          name: 'Change the Color Forward',
          hotkeys: [{modifiers: ["Mod", "Shift"], key: "c"}],
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
          hotkeys: [{modifiers: ["Mod", "Shift"], key: "z"}],
          callback: () => {
            this.prevIndex = this.curIndex;
            this.curIndex = this.curIndex == 0 ? 4 : this.curIndex - 1;

            colorDivs[this.prevIndex].style.borderStyle = 'none';
            colorDivs[this.curIndex].style.borderStyle = 'solid';

            this.curColor = rgbConverter.rgbToHex(colorDivs[this.curIndex].style.backgroundColor);
          }
        })

        // -------------------- Status Bar -------------------- //
        var statusBarColor = this.addStatusBarItem();

        const colorDivs: HTMLDivElement[] = [];
        for(let i = 0; i < 5; i++) {
          var colorText = statusBarColor.createEl('div', { cls: 'status-color' });
          colorText.style.backgroundColor = DEFAULT_COLOR;

          colorDivs.push(colorText);
        }

        colorDivs[0].style.borderStyle = 'solid';
    }
}