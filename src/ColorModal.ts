import { App, Modal, Setting } from "obsidian";

export class ColorModal extends Modal {
  colorResult: string;
  private prevColor: string;
  onSubmit: (result: string) => void;

  constructor(app: App, prevColor: string, onSubmit: (result: string) => void) {
    super(app);
    this.onSubmit = onSubmit;

    this.prevColor = prevColor;
    this.colorResult = prevColor;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Color picker" });

    new Setting(contentEl)
        .setName("Font Color")
        .addColorPicker((color) =>
            color
            .setValue(this.prevColor)
            .onChange((value) => {
                this.colorResult = value;
            }));

    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Submit")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(this.colorResult);
          }));
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}