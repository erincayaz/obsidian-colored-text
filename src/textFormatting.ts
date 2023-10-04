import {
  ViewUpdate,
  PluginValue,
  EditorView,
  ViewPlugin,
} from "@codemirror/view";

type ShouldInsert = "bold" | "italic" | "none";

class TextFormatting implements PluginValue {

  editorView : EditorView;

  constructor(view: EditorView) {
    this.editorView = view;
  }

  update(update: ViewUpdate) {
    let shouldInsert: ShouldInsert = "none";
    let posAfterAsterisk = 0;

    for (const tr of update.transactions) {
      tr.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
        console.log(tr.startState)
        if (toB - fromA > 0) {
          const insertedCharText = this.editorView.state.doc.slice(fromA, toB);
          const insertedChar = insertedCharText.sliceString(0, insertedCharText.length);
          if(insertedChar.contains('*')) {
            const nextCharText = this.editorView.state.doc.slice(toB, toB + 4);
            const nextChar = nextCharText.sliceString(0, nextCharText.length);

            if(nextChar.contains('<s')) {
              shouldInsert = insertedChar.length === 1 ? 'italic' : 'bold';
              posAfterAsterisk = toB + nextChar.indexOf('<') + 13;
            }
          }
        } // TODO: Remove 'Text Formatting' Logic
      });

      if(shouldInsert) break;
    }

    if (shouldInsert != 'none') {
      setTimeout(() => {
        const insertStyle = shouldInsert === 'bold' ?
            'font-weight:bold; ' : 'font-style:italic; ';
        this.editorView.dispatch({
          changes: { from: posAfterAsterisk, insert: insertStyle }  // Insert '+' or whatever you want
        });
      }, 0);
    }
  }


  destroy() {

  }
}

export const textFormattingPlugin = ViewPlugin.fromClass(TextFormatting);