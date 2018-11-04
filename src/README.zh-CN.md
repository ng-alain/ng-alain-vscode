# ng-alain 的 vscode 代码片断

![Plugin in action](help.gif)

请至[Issuses](https://github.com/cipchk/ng-alain-vscode/issues)提交可能遇到的问题或期望增加的代码片断。

为了更好的使用 ng-alain 工具 CSS 类样式，`3.x` 开始内置同 [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) 相似的功能，若已安装该插件可以在开发 ng-alain 时禁用该插件。

最新版本对应 ng-alain 的 `next` 版本，其他版本：

- [1.x](cipchk.ng-alain-vscode-1.0.12.vsix)

## 如何使用?

你可以任意 `.html` 文件，输入 `na-` 开头会自动出现在智能提醒列表当中；仅此而已！

片断中带有 `attr-` 表示属性，`fn-` 表示事件。

> 建议开启 `"editor.snippetSuggestions": "top"` 配置，可确保代码片断优先级高于内置。

## 文档

更多API接口请参考[ng-alain](https://ng-alain.com/)。

{{#each @global.i18n}}

### {{ title }}

Trigger | Description
--- | ---
{{#each list}}
{{@key}} | {{@this}}
{{/each}}
{{/each}}

## 更新日志

见[CHANGELOG.md](CHANGELOG.md)
