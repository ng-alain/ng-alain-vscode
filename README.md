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


### Alain

Trigger | Description
--- | ---
na-ellipsis | Ellipsis
na-error-collect | Error collect in from
na-footer-toolbar | Footer Toolbar
na-header.action | Header: action area
na-header | Header
na-header.full | Header
na-modal | Modal: Used for custom components
na-modal.edit | Modal: edit mode demo
na-modal.view | Modal: view mode demo
na-se.col-1 | SE: single line
na-se.control-checkbox | SE Control: checkbox
na-se.control-input-group | SE Control: input group
na-se.control-input | SE Control: input
na-se.control-number | SE Control: input number
na-se.control-radio-group | SE Control: radio group
na-se.control-select | SE Control: select
na-se.controlClass | SE Property: class names of control
na-se | SE
na-se.form | SE: form demo
na-se.full | SE: full demo
na-se.modal | SE: modal demo
na-se.page | SE: page demo
na-se.search | SE: search demo
na-st.custom-title | SF: custom title
na-st.custom | SF: custom row
na-st | ST: Use configuration instead of nz-table
na-st.res | ST Property: res
na-sf | SF: Dynamic form
na-sf.edit | SF: edit mode
na-sf.modal | SF: modal demo
na-sf.page | SF: page demo
na-sf.search | SF: search demo
na-sv.currency | SV: currency demo
na-sv | SV: Used to view pages
na-sv.item-custom-title | SV: custom title of item
na-sv.item | SV
na-sv.label-width | SV: fixed label width
na-sv.layout | SV Property: layout
na-sv.size | SV Property: size
na-sv.status | SV: status demo
na-sv.time | SV: time demo
na-sv.type | SV Property: type of item
na-header-css | CSS of Header
na-header-css.right-input | CSS of Header: input in right
na-header-css.right-inputgroup | CSS of Header: input group in right
na-tag-select | Tag select

### Angular

Trigger | Description
--- | ---
ng-container | ng-container
ng-container.for | include *ngFor
ng-container.if | include *ngIf
ng-switch | Switch syntax
ng-router.active-mulit | Router with acitve
ng-router.active | Router with acitve
ng-router | Router
ng-router.query | Router with parameters
ng-template | ng-template
ng-template.outlet | include Outlet
ng-template.recursive-tree | Template recursive tree

### TypeScript

Trigger | Description
--- | ---
na-http.delete | HTTP Request: delete
na-http.get | HTTP Request: get
na-http.post | HTTP Request: post
na-modal.close | Close dialog code
na-sf | SF
na-sf.field | SF: field
na-sf.select | SF: select of field
na-st.column | ST: description of columns
na-st | ST: definition of columns

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
