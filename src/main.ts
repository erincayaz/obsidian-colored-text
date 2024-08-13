import {Editor, Menu, Plugin} from 'obsidian';
import StatusBar from './statusBar';
import {ColorModal} from "./colorModal";
import {DEFAULT_SETTINGS, IndexMode} from './constants/defaults';
import contextMenu from './contextMenu';
import {SettingsTab} from './settingsTab';
import {ColorsData} from './types/plugin';
import {createEditorExtensionClass} from "./editorExtension/editorExtension";
import removeColor from './colorRemover';
import {ViewPlugin} from "@codemirror/view";
import {ColorHandler} from "./colorHandler";
import CodeMirror from "codemirror";

export default class ColoredFont extends Plugin {
  prevIndex: number;
  curTheme: string;

  colorsData: ColorsData;
  colorBar: StatusBar;
  colorHandler: ColorHandler;

  async onload() {
    // -------------------- Variables Init -------------------- //
    this.curTheme = this.getCurrentTheme();

    // -------------------- Settings -------------------- //
    await this.loadColorData();
    this.addSettingTab(new SettingsTab(this.app, this));

    // -------------------- Status Bar -------------------- //
    this.colorBar = new StatusBar(this);

    // -------------------- Color Handler -------------------- //
    this.colorHandler = new ColorHandler(this.app, this.colorBar);

    // -------------------- Editor Extension -------------------- //
    const EditorExtensionClass = createEditorExtensionClass(this.colorHandler, this.colorBar);
    this.registerEditorExtension(ViewPlugin.fromClass(EditorExtensionClass));

    // -------------------- Intervals -------------------- //
    setInterval(() => {
      this.curTheme = this.getCurrentTheme();
      this.colorBar.refreshBorderColorOfCurrentCell();
    }, 1000);

    // -------------------- Context Menu -------------------- //
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu: Menu, editor: Editor) => {
        contextMenu(menu, editor, this.colorHandler);
      })
    );

    // -------------------- Commands -------------------- //
    this.addCommand({
      id: 'color-text',
      name: 'Color Text',
      hotkeys: [],
      editorCallback: () => {
        this.colorHandler.changeColor();
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
      callback: () => this.colorBar.changeCurrentIndex(IndexMode.Forward)
    })

    this.addCommand({
      id: 'move-color-cell-backwards',
      name: 'Change the Color Backwards',
      hotkeys: [],
      callback: () => this.colorBar.changeCurrentIndex(IndexMode.Backwards)
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
      name: "Activate/Deactivate Colored Text Mode",
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
    new ColorModal(this.app, this, this.colorBar.getCurCellColor(), (result) => {
      this.colorBar.changeCellColor(result);

      this.colorsData.colorArr[this.colorBar.curIndex] = result;
      this.saveColorData();
    }).open();
	}

  async loadColorData() {
    this.colorsData = Object.assign({},
      {
        ...DEFAULT_SETTINGS,
        colorArr: [...DEFAULT_SETTINGS.colorArr],
        favoriteColors: [...DEFAULT_SETTINGS.favoriteColors],
      }, await this.loadData());
  }

  async saveColorData() {
    await this.saveData(this.colorsData);
  }

  handleEditorChange(instance: CodeMirror.Editor, changeObj: CodeMirror.EditorChange) {
    // Get the current cursor position
    const cursor = instance.getCursor();

    // Get the line content
    const line = instance.getLine(cursor.line);

    // Example: Automatically bold text when user types "**" around a word
    const boldRegex = /\*\*(.*?)\*\*/g;

    if (boldRegex.test(line)) {
      const newLine = line.replace(boldRegex, '<b>$1</b>');

      // Replace the line with the modified text
      instance.replaceRange(newLine, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
    }
  }
}
