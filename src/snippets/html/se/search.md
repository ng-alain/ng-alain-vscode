---
description:
  zh-CN: 编辑：搜索示例
  en-US: Search demo for se
---

```html
<form nz-form nzLayout="inline" (ngSubmit)="${1:save}()" se-container>
  <se label="${2:名称}">
    <input nz-input [(ngModel)]="i.${3:name}" name="${3}">
  </se>
  <se>
    <button nz-button nzType="primary">${4:搜索}</button>
  </se>
</form>
```