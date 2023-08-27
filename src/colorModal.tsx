import { App, Modal, Setting } from "obsidian";
import React from "react";
import { Root, createRoot } from "react-dom/client";
import ColorPalette from "./components/ColorPalette";
import ColoredFont from "./main";

export class ColorModal extends Modal {
  private colorResult: string;
  private prevColor: string;
  onSubmit: (result: string) => void;
  private colorPaletteRoot: Root;
  plugin: ColoredFont;

  constructor(app: App, plugin: ColoredFont, prevColor: string, onSubmit: (result: string) => void) {
    super(app);

    this.colorResult = prevColor;
    this.plugin = plugin;
    this.prevColor = prevColor;
    this.onSubmit = onSubmit;
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
          <ColorPalette
            colors={this.plugin.colorsData.favoriteColors}
            onModalColorClick={this.onModalColorClick}
          />
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