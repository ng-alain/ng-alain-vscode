# ng-alain 的 vscode 代码片断

![Plugin in action](help.gif)

请至[Issuses](https://github.com/cipchk/ng-alain-vscode/issues)提交可能遇到的问题或期望增加的代码片断。

最新版本对应 ng-alain 的 `next` 版本，其他版本：

- [1.x](cipchk.ng-alain-vscode-1.0.12.vsix)

## 如何使用?

你可以任意 `.html` 文件，输入 `na-` 开头会自动出现在智能提醒列表当中；仅此而已！

片断中带有 `attr-` 表示属性，`fn-` 表示事件。

> 建议开启 `"editor.snippetSuggestions": "top"` 配置，可确保代码片断优先级高于内置。

## 文档

更多API接口请参考[ng-alain](https://ng-alain.com/)。


### Alain

Trigger | Description
--- | ---
na-ellipsis | 文本自动省略号
na-error-collect | 表单异常消息采集器
na-footer-toolbar | 底部工具栏
na-header.action | 页头：操作区域
na-header | 页头
na-header.full | 页头：完整模式
na-header-css | CSS页头
na-header-css.right-input | CSS页头：右边表单
na-header-css.right-inputgroup | CSS页头：右边表单组
na-modal | 模态框
na-modal.edit | 模态框：编辑模式
na-modal.view | 模态框：查看模式
na-se.col-1 | 编辑：单行
na-se.control-checkbox | 编辑控件：多选框
na-se.control-input-group | 编辑控件：文本框组合
na-se.control-input | 编辑控件：文本框
na-se.control-number | 编辑控件：数字框
na-se.control-radio-group | 编辑控件：单选框组
na-se.control-select | 编辑控件：选择器
na-se.controlClass | 编辑属性：控件区域样式名
na-se | 编辑
na-se.form | 编辑：表单示例
na-se.full | 编辑完整示例
na-se.modal | 编辑：模态框示例
na-se.page | 编辑：页面示例
na-se.search | 编辑：搜索示例
na-sf | 动态表单
na-sf.edit | 动态表单：编辑模式
na-sf.modal | 动态表单：模态页示例
na-sf.page | 动态表单：页面示例
na-sf.search | 动态表单：搜索模式
na-st.custom-title | 表格：自定义标题头
na-st.custom | 表格：自定义列
na-st | 表格
na-st.res | 表格属性：res 参数
na-sv.currency | 查看：货币示例
na-sv | 查看
na-sv.item-custom-title | 查看：自定义标签标题
na-sv.item | 查看：单项
na-sv.label-width | 查看：固定标签宽度
na-sv.layout | 查看属性：布局
na-sv.size | 查看属性：大小
na-sv.status | 查看：状态示例
na-sv.time | 查看：时间示例
na-sv.type | 查看属性：列表内容样式
na-tag-select | 标签选择器

### Angular 内置片断

Trigger | Description
--- | ---
ng-container | ng-container
ng-container.for | 携带 *ngFor
ng-container.if | 携带 *ngIf
ng-router.active-mulit | 路由高亮（多类名）
ng-router.active | 路由高亮
ng-router | 路由链接
ng-router.query | 路由链接带参数
ng-switch | Switch语法
ng-template | ng-template
ng-template.outlet | 携带 Outlet
ng-template.recursive-tree | 模板递归树

### TypeScript 片断

Trigger | Description
--- | ---
na-http.delete | HTTP请求：删除
na-http.get | HTTP请求：获取
na-http.post | HTTP请求：提交
na-modal.close | 关闭对话框代码
na-sf | SF
na-sf.field | SF：字段
na-sf.select | SF：选择器字段
na-st.column | 表格：列描述列
na-st | 表格：列描述变量

## 更新日志

见[CHANGELOG.md](CHANGELOG.md)
