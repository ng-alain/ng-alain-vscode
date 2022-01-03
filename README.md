# ng-alain VSCode Snippets

![Plugin in action](help.gif)

# Note: Starting `11` version, the extension language will follow the display language of VSCode, and there is no need to install different versions of the ng-alain-vscode extension, so will no longer be maintained of [Simplified Chinese Version](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-alain-vscode-zh-CN).

[中文](README.zh-CN.md)

## Features

- Support class intellisense
- Support Class name hover introduction
- Extract i18n key
- Common Angular templates

## Usage

Typing the beginning of `nas-` will automatically appear in the intellisense list; no more!

## Configuration

| Name | Description | Type | Default |
|------|-------------|------|---------|
| `ng-alain-vscode.i18nStatus` | Whether to enable international quick fix, auto: When depend @angular/localize or @ngx-translate/core is enabled | `auto, enabled, disabled` | `auto` |
| `ng-alain-vscode.i18nPipeName` | Internationalization pipeline name | `string` | `i18n` |
| `ng-alain-vscode.i18nData` | Internationalization data | `Array<{ path: string, type: 'file' | 'node' | 'remote'}>` | `[{path: 'src/assets/tmp/i18n/zh-CN.json', type: 'file'}]` |
| `ng-alain-vscode.lessBuildPaths` | `paths` option of lesss compile | `string[]` | - |

## Support Language Versions

Support language list: English, 简体中文, will automatically switch according to the current the display language of VSCode.

> Abort how to changing the display language, pls refer to [Changing the Display Language](https://code.visualstudio.com/docs/getstarted/locales#_changing-the-display-language).
