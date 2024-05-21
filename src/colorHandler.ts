import {App, MarkdownView} from "obsidian";
import {ColorUtils} from "./colorUtils";
import StatusBar from "./statusBar";
import {ColorMode} from "./constants/defaults";

export class ColorHandler {
  app: App;
  colorUtils : ColorUtils;
  colorBar: StatusBar

  constructor(app : App, colorBar : StatusBar) {
    this.app = app;
    this.colorBar = colorBar;

    this.colorUtils = new ColorUtils();
  }

  changeColor(colorMode = ColorMode.Normal) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);

    if (view) {
      const editor = view.editor;
      const selection = editor.getSelection();
      const curCellColor = this.colorBar.getCurCellColor();

      // If it is colored text mode and there is no selection, return
      if(selection.length === 0 && colorMode === ColorMode.ColoredText)
        return;

      editor.replaceSelection(`<span style="color:${curCellColor}">${selection}</span>`);
      const cursorEnd = editor.getCursor("to");

      try {
        const cursorEndChar = selection.length === 0 ? cursorEnd.ch - 7 : cursorEnd.ch + 1;
        editor.setCursor(cursorEnd.line, cursorEndChar);
      }
      catch (e) {
        // This code piece adds space to end of the doc if there is no space left
        const lineText = editor.getLine(cursorEnd.line);
        editor.setLine(cursorEnd.line, lineText + " ");
      }
    }
  }
}