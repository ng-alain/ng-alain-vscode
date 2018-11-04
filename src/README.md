# ng-alain VSCode Snippets

![Plugin in action](help.gif)

In order to better use ng-alain tool CSS styles, The `3.x` version has built-in similar to [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion), If you are already installed, it can be disabled when developing ng-alain project.

[中文](README.zh-CN.md)

## Links

- [issues](https://github.com/cipchk/ng-alain-vscode/issues)
- [expect snippet](https://github.com/cipchk/ng-alain-vscode/issues)

## Other versions

The latest version corresponds to the `next` version of ng-alain, other versions:

- [1.x](cipchk.ng-alain-vscode-1.0.12.vsix)

## Usage

Typing the beginning of `na-` will automatically appear in the intellisense list; no more!

- `na-` prefix is complete fragment
- `na` (not `-`) prefix is attribute fragment

> To ensure ng-alain snippets suggestions are always on top in the suggestion list, add the following settings `"editor.snippetSuggestions": "top"`.

## Document

More API interface please refer to [ng-alain](https://ng-alain.com/).

{{#each @global.i18n}}

### {{ title }}

Trigger | Description
--- | ---
{{#each list}}
{{@key}} | {{@this}}
{{/each}}
{{/each}}

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
