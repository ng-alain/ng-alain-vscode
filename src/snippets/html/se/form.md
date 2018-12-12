---
description:
  zh-CN: 编辑：表单示例
  en-US: Form demo for se
---

```html
<form nz-form #f="ngForm" se-container>
  <se label="$2">
    $0
  </se>
  <se>
    <button nz-button nzType="primary" [disabled]="f.invalid">${1:保存}</button>
  </se>
</form>
```