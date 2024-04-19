import {EditorView, ViewUpdate} from "@codemirror/view";

type ShouldInsert = "bold" | "italic" | "none";

export class TextFormatting {
  editorView : EditorView;

  shouldInsert : ShouldInsert;
  posAfterAsterisk : number;

  constructor(view : EditorView) {
    this.editorView = view;

    this.shouldInsert = 'none';
    this.posAfterAsterisk = 0;
  }

  // This function detects if bold or italic markdown added. And if it is added, it will return boolean accordingly
  detectMarkdown(update : ViewUpdate) {
    this.shouldInsert = 'none';

    for (const tr of update.transactions) {
      tr.changes.iterChanges((fromA, toA, fromB, toB) => {
        if (toB - fromA > 0) {
          const insertedCharText = this.editorView.state.doc.slice(fromA, toB);
          const insertedChar = insertedCharText.sliceString(0, insertedCharText.length);
          if(insertedChar.contains('*')) {
            const nextCharText = this.editorView.state.doc.slice(toB, toB + 4);
            const nextChar = nextCharText.sliceString(0, nextCharText.length);

            if(nextChar.contains('<s')) {
              this.shouldInsert = insertedChar.length === 1 ? 'italic' : 'bold';
              this.posAfterAsterisk = toB + nextChar.indexOf('<') + 13;
            }
          }
        }
      });

      if(this.shouldInsert) break;
    }

    return this.shouldInsert !== 'none';
  }

  updateEditor() {
    setTimeout(() => {
      const insertStyle = this.shouldInsert === 'bold' ?
          'font-weight:bold; ' : 'font-style:italic; ';
      this.editorView.dispatch({
        changes: { from: this.posAfterAsterisk, insert: insertStyle }
      });
    }, 0);
  }
}