import {
  ViewUpdate,
  PluginValue,
  EditorView
} from "@codemirror/view";
import {TextFormatting} from "./textFormatting";
import ColoredFont from "../main";

export class EditorExtension implements PluginValue {
  editorView : EditorView;
  textFormatting : TextFormatting;
  plugin : ColoredFont;

  handleMouseUp = () => {
    if(this.plugin.highlightMode)
      this.plugin.changeColor();
  }

  constructor(view: EditorView, plugin : ColoredFont) {
    this.editorView = view;
    this.textFormatting = new TextFormatting(view);
    this.plugin = plugin;

    this.editorView.contentDOM.addEventListener('mouseup', this.handleMouseUp)
  }

	update(update: ViewUpdate) {
		if(this.textFormatting.detectMarkdown(update)) {
			this.textFormatting.updateEditor();
		}
	}

  destroy() {
    this.editorView.contentDOM.removeEventListener('mouseup', this.handleMouseUp)
  }
}

export function createEditorExtensionClass(plugin: ColoredFont) {
	return class extends EditorExtension {
		constructor(view: EditorView) {
			super(view, plugin);
		}
	};
}
