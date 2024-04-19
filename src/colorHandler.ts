import {App, MarkdownView} from "obsidian";
import {RgbConverter} from "./rgbConverter";
import StatusBar from "./statusBar";
import {ColorMode} from "./constants/defaults";

export class ColorHandler {
  app: App;
  rgbConverter : RgbConverter;
  colorBar: StatusBar

  constructor(app : App, colorBar : StatusBar) {
    this.app = app;
    this.colorBar = colorBar;

    this.rgbConverter = new RgbConverter();
  }

  changeColor(colorMode = ColorMode.Normal) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);

    if (view) {
      const editor = view.editor;
      const selection = editor.getSelection();
      const curCellColor = this.colorBar.getCurCellColor();

      // If it is highlight mode and there is no selection, return
      if(selection.length === 0 && colorMode === ColorMode.Highlight)
        return;

      editor.replaceSelection(`<span style="color:${curCellColor}">${selection}</span>`);
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