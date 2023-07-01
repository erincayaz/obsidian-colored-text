import { App, PluginSettingTab, Setting } from "obsidian";
import ColoredFont from "./main";

export class SettingsTab extends PluginSettingTab {
    plugin: ColoredFont;
  
    constructor(app: App, plugin: ColoredFont) {
      super(app, plugin);
      this.plugin = plugin;
    }
  
    display(): void {
      let { containerEl } = this;
  
      containerEl.empty();
  
      new Setting(containerEl)
        .setName("Number of Color Cells")
        .setDesc("Change number of color cells (You need to reload Obsidian for changes to occur)")
        .addText((text) =>
          text
            .setPlaceholder("5")
            .setValue(this.plugin.colorsData.colorCellCount)
            .onChange(async (value) => {
              this.plugin.colorsData.colorCellCount = value;
              await this.plugin.saveColorData();
            })
        );
      
      const favoriteColors = new Setting(containerEl)
        .setName("Favorite Colors")
        .setDesc("Set your favorite colors to pick from");
      
      this.plugin.colorsData.favoriteColors.forEach((c, i) => {
        favoriteColors
        .addColorPicker((color) =>
          color
            .setValue(c)
            .onChange(async (value) => {
              this.plugin.colorsData.favoriteColors[i] = value;
              await this.plugin.saveColorData();
            })
        ) 
      });
    }
  }