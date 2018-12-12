---
description:
  zh-CN: 编辑：页面示例
  en-US: Page demo using se
---

```html
<form nz-form #f="ngForm" (ngSubmit)="${1:save}()">
  <nz-card se-container="${2|1,2,3,4,5,6|}" gutter="24">
    $0
  </nz-card>
  <footer-toolbar errorCollect>
    <button nz-button nzType="primary" [disabled]="f.invalid" [nzLoading]="http.loading">${3:保存}</button>
  </footer-toolbar>
</form>
```