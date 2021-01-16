# ng-alain 的 vscode 代码片断

![Plugin in action](help.gif)

请至[Issuses](https://github.com/cipchk/ng-alain-vscode/issues)提交可能遇到的问题或期望增加的代码片断。

[英文](README.md)

## 特征

- 支持 Class 类名智能提醒
- 支持 Class 类名悬停介绍
- 抽取国际化 i18n 键
- 常见的Angular模板

## 如何使用?

你可以任意 `.html`、`.ts` 文件，输入 `nas-` 开头会自动出现在智能提醒列表当中；仅此而已！

## 配置项

| 名称 | 描述 | 类型 | 默认值 |
|------|-------------|------|---------|
| `ng-alain-vscode.i18nStatus` | 是否启用国际化快速修复，auto: 当发现依赖 @angular/localize 或 @ngx-translate/core 时表示启用 | `auto, enabled, disabled` | `auto` |
| `ng-alain-vscode.i18nPipeName` | 国际化管道名称 | `string` | `i18n` |
| `ng-alain-vscode.i18nData` | 国际化数据配置 | `Array<{ path: string, type: 'file' | 'node' | 'remote'}>` | `[{path: 'src/assets/tmp/i18n/zh-CN.json', type: 'file'}]` |

## 支持语言版本

支持语言列表：英文、简体中文，会根据 VSCode 当前语言自动切换。

> 关于如何切换 VSCode 语言，请参考 [Changing the Display Language](https://code.visualstudio.com/docs/getstarted/locales#_changing-the-display-language) 章节。
