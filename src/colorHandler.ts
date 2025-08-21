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

      // Handle italic and bold text
      let newText = selection;
      newText = newText
        // Italic and Bold: ***text*** or ___text___ to <b><i> tags
        .replace(/[\*\_]{3}(.+?)[\*\_]{3}/g, '<b><i>$1</i></b>')
        // Bold: **text** or __text__ to <b> tag
        .replace(/[\*\_]{2}(.+?)[\*\_]{2}/g, '<b>$1</b>')
        // Italic: *text* or _text_ to <i> tag
        .replace(/[\*\_](.+?)[\*\_]/g, '<i>$1</i>');
      // New line: \n to <br> tag
      newText = newText.replace(/\n/g, '<br>');

      editor.replaceSelection(`<span style="color:${curCellColor}">${newText}</span>`);
      const cursorEnd = editor.getCursor("to");

      try {
        const cursorEndChar = newText.length === 0 ? cursorEnd.ch - 7 : cursorEnd.ch + 1;
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