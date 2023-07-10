# Obsidian Colored Text Plugin

This is a plugin for [Obsidian](https://obsidian.md/) for adding colored texts to your notes.

> This plugin is still in development. Features implemented and the way to use them is not final. Any suggestion regarding to those is appriciated.

## Features

- There are slots for storing colors which can be in status bar. By default, the number of slots is set to 5, but it can be adjusted to any value between 1 and 20 in the settings.
- You can switch between slots, either by using hotkeys or by clicking to color slots
- You can change the current slot's color by opening color input menu, by using hotkey
- In the input menu, there are two ways to select colors. You can either select from favorite colors, which is set to most used colors by default and can be customized in the settings, or you can select a customized color by using color palette
- You can change the color of the selected text into current slot's color by using hotkey or mouse

## Usage

Right now there are 4 commands available:
- Change color of selected text
- Switch between slots, forward
- Switch between slots, backwards
- Color input

I suggest using hotkeys for these commands as I designed this plugin with a keyboard-centric approach.

## Demo

![Colored Text Demo](https://github.com/erincayaz/obsidian-colored-text/blob/main/demo/DemoPlugin.gif)

## Roadmap

- [x] Saving the condition of status bar to use it after reopening the app 
- [x] Adjusting count of color cells in status bar
- [x] Ability to change color using right click
- [x] Selecting favorite colors in the settings and ability to select from those
- [ ] Latex/Mathjax Support will be added
- [ ] Tests will be implemented
