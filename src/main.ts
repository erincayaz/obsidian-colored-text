import { Editor, MarkdownView, Menu, Plugin } from 'obsidian';
import ColorBar from './ColorBar';
import { ColorModal } from "./ColorModal";
import { RGBConverter } from "./RGBConverter";
import { DEFAULT_COLOR, DEFAULT_SETTINGS, MAX_CELL_COUNT } from './constants/defaults';
import contextMenu from './contextMenu';
import { SettingsTab } from './settings';
import { ColorsData } from './types/plugin';

export default class ColoredFont extends Plugin {
    curColor: string;
    curIndex: number;
    prevIndex: number;
    colorsData: ColorsData;
    cellCount: number;
    colorDivs: HTMLDivElement[] = [];

    colorBar: ColorBar;
    rgbConverter = new RGBConverter();

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
            new ColorModal(this.app, this, this.curColor, (result) => {
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

        // --------------------  Remove Color Under Cursor-------------------- //
        this.addCommand({
          id: "remove-color",
          name: "Remove Color Under Cursor",
          hotkeys: [],
          editorCallback:(editor, view) => {
            const fromCursor = editor.getCursor('from');
            const toCursor = editor.getCursor('to');
        
            // Currently only works for single line, no selection, just cursor
            if (fromCursor.ch != toCursor.ch && fromCursor.line != toCursor.line) {
              return;
            }

            const cursor = fromCursor;
            const line = editor.getLine(cursor.line);

            const spanRegex = /<span style=".*?">(.*?)<\/span>(.*?)/;
            let d = 0;
            let sub = line.substring(d);

            let found = false;
            while (!found && sub.search(spanRegex) != -1) {
              const pos = sub.search(spanRegex);
              d += pos;
              const close = sub.substring(pos).search('</span>');

              if (cursor.ch >= d && cursor.ch < d + close + '</span>'.length) {
                const newLine = line.substring(0, d) + line.substring(d).replace(spanRegex, '$1$2');
                editor.setLine(cursor.line, newLine);
                editor.setCursor({ line: cursor.line, ch: d });
                found = true;
              } else {
                sub = sub.substring(pos+1);
              }
            }
          }
        });
    }

    selectColor(newIndex: number) {      
      this.prevIndex = this.curIndex;
      this.curIndex = newIndex;

      this.colorDivs[this.prevIndex].style.borderStyle = 'none';
      this.colorDivs[this.curIndex].style.borderStyle = 'solid';

      this.curColor = this.rgbConverter.rgbToHex(this.colorDivs[this.curIndex].style.backgroundColor);
    }

    handleColorChangeInContextMenu = (
      menu: Menu,
      editor: Editor,
    ): void => {
      contextMenu(app, menu, editor, this, this.curColor);
    }

    async loadColorData() {
      this.colorsData = Object.assign({}, 
        {
          ...DEFAULT_SETTINGS,
          colorArr: [...DEFAULT_SETTINGS.colorArr],
          favoriteColors: [...DEFAULT_SETTINGS.favoriteColors],
        }, await this.loadData());
      this.curColor = this.colorsData.colorArr[0];
    }

    async saveColorData() {
      await this.saveData(this.colorsData);
    }
}
