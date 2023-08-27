import { Editor } from "obsidian";

export default function removeColor(
    editor: Editor
) : void {
        const fromCursor = editor.getCursor('from');
        const toCursor = editor.getCursor('to');

        const spanRegex = /<span style=".*?">(.*?)<\/span>(.*?)/;
        const spanRegexG = /<span style=".*?">(.*?)<\/span>(.*?)/g;
        const beginRegex = /<span style=".*?">/;
        const endString = "</span>";

        if (fromCursor.ch == toCursor.ch && fromCursor.line == toCursor.line) {
            const cursor = fromCursor;
            const line = editor.getLine(cursor.line);

            let d = 0;
            let sub = line.substring(d);

            let found = false;
            while (!found && sub.search(spanRegex) != -1) {
                const pos = sub.search(spanRegex);
                d += pos;
                const close = sub.substring(pos).search(endString);

                if (cursor.ch >= d && cursor.ch < d + close + endString.length) {
                    const newLine = line.substring(0, d) + line.substring(d).replace(spanRegex, '$1$2');
                    editor.setLine(cursor.line, newLine);
                    editor.setCursor({ line: cursor.line, ch: d });
                    found = true;
                } else {
                    sub = sub.substring(pos+1);
                }
            }
        } else {
            const lines = [...Array(toCursor.line - fromCursor.line + 1)]
                .map((x, i) => editor.getLine(fromCursor.line + i));
            const lastInd = lines.length - 1;
            lines[lastInd] = lines[lastInd].substring(0, toCursor.ch);
            lines[0] = lines[0].substring(fromCursor.ch);

            let unendedBeginIndex = null;
            for (const [i, l] of lines.entries()) {
                let newLine = l;
                newLine = newLine.replaceAll(spanRegexG, '$1$2')

                lines[i] = newLine;

                if (newLine.search(endString) != -1 && unendedBeginIndex) {
                    const j = unendedBeginIndex.line;
                    const ch = unendedBeginIndex.ch;
                    lines[j] = 
                        lines[j].substring(0, ch) + 
                        lines[j].substring(ch).replace(beginRegex, '');
                    lines[i] = lines[i].replace(endString, '');
                }

                if (newLine.search(beginRegex) != -1) {
                    unendedBeginIndex = {line: i, ch: newLine.search(beginRegex)}
                }
            }

            lines[0] = editor.getLine(fromCursor.line).substring(0, fromCursor.ch) + lines[0];
            lines[lastInd] = lines[lastInd] + editor.getLine(toCursor.line).substring(toCursor.ch);

            lines.map((l, i) => editor.setLine(fromCursor.line + i, l));
            editor.setCursor(fromCursor);
        }   
}