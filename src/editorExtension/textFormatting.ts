import {EditorView, ViewUpdate} from "@codemirror/view";

type ShouldInsert = "bold" | "italic" | "none";

export class TextFormatting {
  editorView : EditorView;

  shouldInsert : ShouldInsert;
  changes : any;

  constructor(view : EditorView) {
    this.editorView = view;

    this.shouldInsert = 'none';
  }

  detectSandwichAsterisks(update : ViewUpdate) {
    for (const tr of update.transactions) {
      const changes = tr.changes.toJSON();

      // This checks if asterisk is added and if it is added to both side
      // And also checks if it is colored text html element
      if(changes.length === 5 && Array.isArray(changes[1]) && Array.isArray(changes[3])
        && changes[1].length === 2 && changes[3].length === 2
        && changes[1][1].contains('*') && changes[3][1].contains('*'))
      {
        const selectedText = this.editorView.state.doc.slice(changes[0], changes[0] + changes[2]).sliceString(0);
        if(selectedText.contains("span") && selectedText.contains("color")) {
          this.shouldInsert = changes[1][1].length === 1 ? 'italic' : 'bold';
          this.changes = changes;

          return true
        }
      }
      else if(changes.length === 4 && Array.isArray(changes[0]) && Array.isArray(changes[2])
        && changes[0].length === 2 && changes[2].length === 2
        && changes[0][1].contains('*') && changes[2][1].contains('*'))
      {
        const selectedText = this.editorView.state.doc.slice(0, changes[1]).sliceString(0);
        if(selectedText.contains("span") && selectedText.contains("color")) {
          this.shouldInsert = changes[0][1].length === 1 ? 'italic' : 'bold';
          changes.unshift(0); // This is used to transform changes into desired format
          this.changes = changes;

          return true
        }
      }
      else if(changes.length === 4 && Array.isArray(changes[1]) && Array.isArray(changes[3])
        && changes[1].length === 2 && changes[3].length === 2
        && changes[1][1].contains('*') && changes[3][1].contains('*'))
      {
        const selectedText = this.editorView.state.doc.slice(changes[0], changes[0] + changes[2]).sliceString(0);
        if(selectedText.contains("span") && selectedText.contains("color")) {
          this.shouldInsert = changes[1][1].length === 1 ? 'italic' : 'bold';
          changes.push(0); // This is used to transform changes into desired format
          this.changes = changes;
          
          return true
        }
      }
    }

    return false;
  }

  addStylingToSandwichAsterisks(update : ViewUpdate) {
    if(this.shouldInsert === 'none')
      return;
    
    let anchorPos = 0;
    const styleText =
      this.shouldInsert === 'bold' ? 'font-weight:bold; ' : 'font-style:italic; ';

    // Remove added asterisks
    const textLen = this.changes[1][1].length;
    const editorChanges : any = [
      { from: this.changes[0], to: this.changes[0] + textLen, insert: "" },
      { from: this.changes[0] + this.changes[2] + textLen, to: this.changes[0] + this.changes[2] + (textLen * 2), insert: "" }
    ]

    // Looks if added styling exists, if exists doesn't add it
    const selectedText = this.editorView.state.doc.slice(this.changes[0], this.changes[0] + this.changes[2]).sliceString(0);
    if(!selectedText.contains(this.shouldInsert)) {
      editorChanges.push({ from: this.changes[0] + 13 + textLen, insert: styleText })
      anchorPos = this.changes[0] + this.changes[2] + styleText.length + 1;
    }
    // Remove styling of font if it is already added
    else {
      const idx = selectedText.search(styleText);
      const from = this.changes[0] + idx;
      const to = from + styleText.length;

      editorChanges.push({ from: from, to: to, insert: ""});
      anchorPos = this.changes[0] + this.changes[2] - styleText.length + 1;
    }

    // Move anchor to one pos left if it is end of the file
    if (this.changes[4] === 0) {
      anchorPos -= 1;
    }

    // Call dispatch
    setTimeout(() => {
      this.editorView.dispatch({
        changes: editorChanges,
        selection: { anchor: anchorPos } // Move the cursor to end of the html element
      })
    })
  }
}