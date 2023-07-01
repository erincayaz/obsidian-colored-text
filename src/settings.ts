import { App, BaseComponent, ColorComponent, PluginSettingTab, Setting } from "obsidian";
import { DEFAULT_SETTINGS } from "./constants/defaults";
import ColoredFont from "./main";

export class SettingsTab extends PluginSettingTab {
    plugin: ColoredFont;
    favoriteColorsSetting: Setting;

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
      
      this.favoriteColorsSetting = new Setting(containerEl)
        .setName("Favorite Colors")
        .setDesc("Set your favorite colors to pick from");
      
      this.plugin.colorsData.favoriteColors.forEach((c, i) => {
        this.favoriteColorsSetting
        .addColorPicker((color) =>
          color
            .setValue(c)
            .onChange(async (value) => {
              this.plugin.colorsData.favoriteColors[i] = value;
              await this.plugin.saveColorData();
            })
        ) 
      });

      /* Restore default favorite colors */
      this.favoriteColorsSetting.addExtraButton((button) => {
        button
          .setIcon("rotate-ccw")
          .setTooltip("Restore defaults")
          .onClick(async () => {
              if (DEFAULT_SETTINGS.favoriteColors !== undefined) {
                this.plugin.colorsData.favoriteColors = [...DEFAULT_SETTINGS.favoriteColors];
              }
              this.reloadColors(this.favoriteColorsSetting.components);
              await this.plugin.saveColorData();
          })
      });
    }
    
    reloadColors(components: BaseComponent[]) {
      let i = 0;
      for (const component of components) {
        if (component instanceof ColorComponent) {
          (component as ColorComponent)
            .setValue(this.plugin.colorsData.favoriteColors[i]);
          i++;
        }
      }
    }
  }