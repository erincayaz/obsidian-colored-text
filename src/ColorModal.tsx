import ColorPalette from "components/ColorPalette";
import { App, Modal, Setting } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

export class ColorModal extends Modal {
  private colorResult: string;
  private prevColor: string;
  onSubmit: (result: string) => void;

  constructor(app: App, prevColor: string, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;

    this.prevColor = prevColor;
    this.colorResult = prevColor;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.createEl("h1", { text: "Color Picker" });
    contentEl.createDiv();
    const colorPaletteRoot = createRoot(contentEl.children[1]);

    colorPaletteRoot.render(
      <React.StrictMode>
        <div
          className="setting-item"
          style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <div>Select a color</div>
          <ColorPalette onModalColorClick={this.onModalColorClick} />
        </div>
      </React.StrictMode>
    );

    new Setting(contentEl)
      .setName("Custom color")
      .addColorPicker((color) =>
        color
          .setValue(this.prevColor)
          .onChange((value) => {
            this.colorResult = value;
          })
      );

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.colorResult);
          })
      );
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();

    ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
  }

  onModalColorClick = (color: string) => {
    this.colorResult = color;
  }
}