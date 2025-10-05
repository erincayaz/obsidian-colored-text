import { App, MarkdownView } from "obsidian";
import { ColorUtils } from "./colorUtils";
import StatusBar from "./statusBar";
import { ColorMode } from "./constants/defaults";

export class ColorHandler {
  app: App;
  colorUtils: ColorUtils;
  colorBar: StatusBar

  constructor(app: App, colorBar: StatusBar) {
    this.app = app;
    this.colorBar = colorBar;

    this.colorUtils = new ColorUtils();
  }

  private nodeLength(n: any): number {
    if (!n) return 0;
    if (n.innerHTML) return n.innerHTML.length;
    if (n.textContent) return n.textContent.length;
    return 0;
  }

  private getGlobalOffsets(range: Range): { startOffset: number; endOffset: number } {
    let startOffset = range.startOffset;
    let wordLength = range.endOffset - range.startOffset;

    // Calculate the offset from the start of the document
    let node: Node | null = range.startContainer;
    let prev = node.previousSibling;
    while (prev) {
      startOffset += this.nodeLength(prev);
      prev = prev.previousSibling;
    }

    const endOffset = startOffset + wordLength;

    return { startOffset, endOffset };
  }


  changeColor(colorMode = ColorMode.Normal) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);

    // Markdown View
    if (view) {
      const editor = view.editor;
      const selection = editor.getSelection();
      const curCellColor = this.colorBar.getCurCellColor();

      // If it is colored text mode and there is no selection, return
      if (selection.length === 0 && colorMode === ColorMode.ColoredText)
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

    // Canvas View
    const canvasView = this.app.workspace.getActiveViewOfType(Object as any);
    if (canvasView && (canvasView as any).canvas) {
      const selectedNodes = Array.from((canvasView as any).canvas.selection.values());
      const curCellColor = this.colorBar.getCurCellColor();

      for (const node of selectedNodes) {
        const data = (node as any).getData();
        if (data.type === "text") {
          const nodeEl = (node as any).nodeEl;
          const iframe = nodeEl.querySelector("iframe.embed-iframe") as HTMLIFrameElement;

          if (iframe) {
            const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
            const selection = innerDoc?.getSelection();

            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const selectedText = selection.toString();

              if (selectedText.length === 0 && colorMode === ColorMode.ColoredText) return;
              if (!innerDoc) return;

              const data = (node as any).getData();
              const fullText = data.text;

              const { startOffset, endOffset } = this.getGlobalOffsets(range);

              const before = fullText.slice(0, startOffset);
              const after = fullText.slice(endOffset);
              const wrapped = `<span style="color:${curCellColor}">${selectedText}</span>`;

              const newHtml = before + wrapped + after;

              (node as any).setData({
                ...data,
                text: newHtml,
              });

              if (selection) {
                try { selection.removeAllRanges(); } catch(e) { }
              }
            }
          }
        }
      }
    }
  }
}