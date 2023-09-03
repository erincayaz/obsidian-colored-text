# Obsidian Colored Text Plugin

This is a plugin for [Obsidian](https://obsidian.md/) for adding colored texts to your notes.

> This plugin is still in development. The features implemented and the way to use them are not final. Any suggestion regarding those is appreciated.

## Features

- There are slots for storing colors which can be in the status bar. By default, the number of slots is set to 5, but it can be adjusted to any value between 1 and 20 in the settings.
- You can switch between slots, either by using hotkeys or by clicking on color slots
- You can change the current slot's color by opening the color input menu, by using the hotkey, or by clicking the desired color cell in the status bar
- In the input menu, there are two ways to select colors. You can either select from your favorite colors, which is set to the most used colors by default and can be customized in the settings, or you can select a customized color by using the color palette
- You can change the color of the selected text into the current slot's color by using the assigned hotkey or right-clicking
- You can remove the color of the selected text by using the assigned hotkey or right-clicking

## Usage

Right now there are 5 commands available:
- Change the color of the selected text
- Remove the color of the selected text
- Switch between slots, forward
- Switch between slots, backwards
- Open the color input menu

I suggest using hotkeys for these commands as I designed this plugin with a keyboard-centric approach.

## Demo

![Colored Text Demo](https://github.com/erincayaz/obsidian-colored-text/blob/main/demo/DemoPlugin.gif)

## Roadmap

- [x] Saving the condition of the status bar to use it after reopening the app 
- [x] Adjusting the count of color cells in the status bar
- [x] Ability to change color using right click
- [x] Selecting favorite colors in the settings and ability to select from those
- [ ] Latex/Mathjax Support will be added
- [ ] Tests will be implemented
