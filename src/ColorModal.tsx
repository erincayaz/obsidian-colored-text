import ColorPalette from "components/ColorPalette";
import { App, Modal, Setting } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import { Root, createRoot } from "react-dom/client";

export class ColorModal extends Modal {
  private colorResult: string;
  private prevColor: string;
  onSubmit: (result: string) => void;
  private colorPaletteRoot: Root;

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
    this.colorPaletteRoot = createRoot(contentEl.children[1]);

    this.colorPaletteRoot.render(
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
    this.colorPaletteRoot.unmount();
    contentEl.empty();
  }

  onModalColorClick = (color: string) => {
    this.colorResult = color;
  }
}