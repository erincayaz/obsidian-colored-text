import {EditorView, ViewUpdate} from "@codemirror/view";

export class TextFormatting {
  editorView: EditorView;

  constructor(view: EditorView) {
    this.editorView = view;
  }

  detectSandwichAsterisks(update: ViewUpdate): boolean {
    for (const tr of update.transactions) {
      const changes = tr.changes.toJSON();

      if (this.isValidAsteriskChange(changes)) {
        return true;
      }
    }
    return false;
  }

  private isValidAsteriskChange(changes: any): boolean {
    const hasAsterisks = changes.some((change: any) => 
      Array.isArray(change) && change.length === 2 && change[1]?.includes('*')
    );
    
    if (!hasAsterisks) return false;

    const text = this.getAffectedText(changes);
    return text.includes("span") && text.includes("color");
  }

  private getAffectedText(changes: any): string {
    let startPos = 0;
    let length = 0;

    if (changes.length === 5 && Array.isArray(changes[1])) {
      startPos = changes[0];
      length = changes[2];
    } else if (changes.length === 4 && Array.isArray(changes[0])) {
      startPos = 0;
      length = changes[1];
    } else if (changes.length === 4 && Array.isArray(changes[1])) {
      startPos = changes[0];
      length = changes[2];
    }

    return this.editorView.state.doc.slice(startPos, startPos + length).sliceString(0);
  }

  addStylingToSandwichAsterisks(update: ViewUpdate) {
    for (const tr of update.transactions) {
      const changes = tr.changes.toJSON();
      
      if (!this.isValidAsteriskChange(changes)) continue;

      const { startPos, textLength, asteriskCount } = this.parseChanges(changes);
      
      let spanText = this.editorView.state.doc
        .slice(startPos, startPos + textLength + asteriskCount * 2)
        .sliceString(0);

      spanText = spanText.slice(asteriskCount, -asteriskCount);

      const newText = this.toggleFormattingTags(spanText, asteriskCount);

      const cursorPos = startPos + newText.length;

      setTimeout(() => {
        this.editorView.dispatch({
          changes: {
            from: startPos,
            to: startPos + textLength + asteriskCount * 2,
            insert: newText
          },
          selection: { anchor: cursorPos }
        });
      });
    }
  }

  private parseChanges(changes: any): { startPos: number; textLength: number; asteriskCount: number } {
    let startPos = 0;
    let textLength = 0;
    let asteriskCount = 1;

    if (changes.length === 5 && Array.isArray(changes[1])) {
      startPos = changes[0];
      textLength = changes[2];
      asteriskCount = changes[1][1].length;
    } else if (changes.length === 4 && Array.isArray(changes[0])) {
      startPos = 0;
      textLength = changes[1];
      asteriskCount = changes[0][1].length;
    } else if (changes.length === 4 && Array.isArray(changes[1])) {
      startPos = changes[0];
      textLength = changes[2];
      asteriskCount = changes[1][1].length;
    }

    return { startPos, textLength, asteriskCount };
  }

  private toggleFormattingTags(text: string, asteriskCount: number): string {
    const isBold = asteriskCount === 2;
    
    if (isBold) {
      if (text.includes('<b>') && text.includes('</b>')) {
        return text.replace(/<b>/g, '').replace(/<\/b>/g, '');
      } else {
        return text.replace(/(<span[^>]*>)([\s\S]*?)(<\/span>)/, '$1<b>$2</b>$3');
      }
    } else {
      if (text.includes('<i>') && text.includes('</i>')) {
        return text.replace(/<i>/g, '').replace(/<\/i>/g, '');
      } else {
        return text.replace(/(<span[^>]*>)([\s\S]*?)(<\/span>)/, '$1<i>$2</i>$3');
      }
    }
  }
}