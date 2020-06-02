# ng-alain VSCode Snippets

![Plugin in action](help.gif)

In order to better use ng-alain tool CSS styles, The `3.x` version has built-in similar to [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion), If you are already installed, it can be disabled when developing ng-alain project.

[中文](README.zh-CN.md)

## Language Versions

- [English Version](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-alain-vscode)
- [中文版本](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-alain-vscode-zh-CN)

## Links

- [issues](https://github.com/cipchk/ng-alain-vscode/issues)
- [Marketplace](https://marketplace.visualstudio.com/items?itemName=cipchk.ng-alain-vscode)

## Usage

Typing the beginning of `nas-` will automatically appear in the intellisense list; no more!

## FAQ

### Class name (for example: `text-center`) cannot be intellisense?

It may be that there is a lack of automatic installation dependencies. You can manually install it and enter:

```bash
# Mac
cd /Users/[UserName]/.vscode/extensions/cipchk.ng-alain-vscode-[Version]/
yarn
# Windows
cd C:\Users\[UserName]\.vscode\extensions\cipchk.ng-alain-vscode-[Version]\
yarn
```

Restart VSCODE

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
