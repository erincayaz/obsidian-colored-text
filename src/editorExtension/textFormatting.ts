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

  detectSandwichAsterisks(update : ViewUpdate) {
    for (const tr of update.transactions) {
      const changes = tr.changes.toJSON();

      if(changes.length === 5 && Array.isArray(changes[1]) && Array.isArray(changes[3])
        && changes[1].length === 2 && changes[3].length === 2
        && changes[1][1].contains('*') && changes[3][1].contains('*'))
      {
        this.shouldInsert = changes[1][1].length === 1 ? 'italic' : 'bold';
        return true
      }
    }

    return false;
  }

  addStylingToSandwichAsterisks(update : ViewUpdate) {
    if(this.shouldInsert === 'none')
      return;

    for (const tr of update.transactions) {
      const changes = tr.changes.toJSON();
      const styleText = this.shouldInsert === 'bold' ?
        'font-weight:bold; ' : 'font-style:italic; ';

      // Remove added asterisks
      const textLen = changes[1][1].length;
      const editorChanges : any = [
        { from: changes[0], to: changes[0] + textLen, insert: "" },
        { from: changes[0] + changes[2] + textLen, to: changes[0] + changes[2] + (textLen * 2), insert: "" }
      ]

      // Looks if added styling exists, if exists doesn't add it
      const selectedText = this.editorView.state.doc.slice(changes[0], changes[0] + changes[2]).sliceString(0);
      if(!selectedText.contains(this.shouldInsert)) {
        editorChanges.push({ from: changes[0] + 13 + textLen, insert: styleText })
      }

      // Call dispatch
      setTimeout(() => {
        this.editorView.dispatch({
          changes: editorChanges,
          selection: { anchor: changes[0] + changes[2] + styleText.length + 1 } // Move the cursor to end of the html element
        })
      })
    }
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
            console.log("* is used");

            const nextCharText = this.editorView.state.doc.slice(toB, toB + 4);
            const nextChar = nextCharText.sliceString(0, nextCharText.length);

            if(nextChar.contains('<s')) {
              this.shouldInsert = insertedChar.length === 1 ? 'italic' : 'bold';
              this.posAfterAsterisk = toB + nextChar.indexOf('<') + 13;
            }
          }
        }
      })

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