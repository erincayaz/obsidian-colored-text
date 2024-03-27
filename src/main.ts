import {Editor, MarkdownView, Menu, Plugin} from 'obsidian';
import StatusBar from './statusBar';
import { ColorModal } from "./colorModal";
import { RgbConverter } from "./rgbConverter";
import { DEFAULT_COLOR, DEFAULT_SETTINGS, MAX_CELL_COUNT } from './constants/defaults';
import contextMenu from './contextMenu';
import { SettingsTab } from './settings';
import { ColorsData } from './types/plugin';
import {createEditorExtensionClass} from "./editorExtension/editorExtension";
import removeColor from './colorRemover';
import {ViewPlugin} from "@codemirror/view";

export default class ColoredFont extends Plugin {
  curColor: string;
  curIndex: number;
  prevIndex: number;
  curTheme: string;

  colorsData: ColorsData;
  cellCount: number;
  hidePlugin: boolean;

  colorBar: StatusBar;
  rgbConverter = new RgbConverter();

  highlightMode : boolean;

  async onload() {
    // -------------------- Variables Init -------------------- //
    this.curColor = DEFAULT_COLOR;
    this.curIndex = 0;
    this.highlightMode = false;
    this.curTheme = this.getCurrentTheme();

    await this.loadColorData();
    this.cellCount = +this.colorsData.colorCellCount > MAX_CELL_COUNT ? MAX_CELL_COUNT : +this.colorsData.colorCellCount;
    this.hidePlugin = this.colorsData.hidePlugin;
    this.addSettingTab(new SettingsTab(this.app, this));

    // -------------------- Editor Extension -------------------- //
    const EditorExtensionClass = createEditorExtensionClass(this);
    this.registerEditorExtension(ViewPlugin.fromClass(EditorExtensionClass));

    // -------------------- Context Menu -------------------- //
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor) => {
        contextMenu(app, menu, editor, this, this.curColor);
      })
    );

    // -------------------- Status Bar -------------------- //
    this.colorBar = new StatusBar(this);
    this.colorBar.addColorCells();
    this.colorBar.addColoredTextMode();

    // -------------------- Commands -------------------- //
    this.addCommand({
      id: 'color-text',
      name: 'Color Text',
      hotkeys: [],
      editorCallback: () => {
        this.changeColor();
      }
    });

    this.addCommand({
      id: 'alter-color-palette',
      name: 'Alter Color Palette',
      hotkeys: [],
      callback: () => {
        this.openColorModal();
      },
    })

    this.addCommand({
      id: 'move-color-cell-forward',
      name: 'Move the Color Cell Forward',
      hotkeys: [],
      callback: () => this.selectColor(this.curIndex == (this.cellCount - 1) ? 0 : this.curIndex + 1)
    })

    this.addCommand({
      id: 'move-color-cell-backwards',
      name: 'Change the Color Backwards',
      hotkeys: [],
      callback: () => this.selectColor(this.curIndex == 0 ? (this.cellCount - 1) : this.curIndex - 1)
    })

    this.addCommand({
      id: "remove-color",
      name: "Remove Color From Selection / Under Cursor",
      hotkeys: [],
      editorCallback:(editor) => {
        removeColor(editor);
      }
    });

    this.addCommand({
      id: "change-colored-text-mode",
      name: "Activate/Deactivate Highlight Mode",
      hotkeys: [],
      editorCallback: () => {
        this.colorBar.clickColoredText()
      }
    })
  }

  onunload() {

  }

  private getCurrentTheme() {
    // @ts-expect-error private
    let theme = this.app.getTheme();
    if (theme === 'moonstone') {
      theme = 'light';
    } else if (theme === 'obsidian') {
      theme = 'dark';
    } else {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return theme;
  }

	openColorModal() {
    new ColorModal(this.app, this, this.curColor, (result) => {
      this.curColor = result;
      this.colorBar.changeCellColor(result);

      this.colorsData.colorArr[this.curIndex] = result;
      this.saveColorData();
    }).open();
	}

  changeColor() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);

    if (view) {
      const editor = view.editor;
      const selection = editor.getSelection();

      if(selection.length > 0) {
        editor.replaceSelection(`<span style="color:${this.curColor}">${selection}</span>`);
        const cursorEnd = editor.getCursor("to");

        try {
          editor.setCursor(cursorEnd.line, cursorEnd.ch + 1);
        }
        catch (e) {
          // This code piece adds space to end of the doc if there is no space left
          const lineText = editor.getLine(cursorEnd.line);
          editor.setLine(cursorEnd.line, lineText + " ");
        }
      }
    }
  }

  selectColor(newIndex: number) {
    this.prevIndex = this.curIndex;
    this.curIndex = newIndex;

    if (!this.hidePlugin) {
      this.colorBar.changeCurrentIndex()
    }

    this.curColor = this.rgbConverter.rgbToHex(this.colorBar.getCurCellColor());
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
