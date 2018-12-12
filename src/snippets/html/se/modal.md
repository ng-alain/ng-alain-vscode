---
description:
  zh-CN: 编辑：模态框示例
  en-US: Modal demo for se
---

```html
<div class="modal-header">
  <div class="modal-title">$1</div>
</div>
<form nz-form #f="ngForm" (ngSubmit)="${2:save}()">
  <div se-container="${3|1,2,3,4,5,6|}">
    $0
  </div>
  <div class="modal-footer">
    <button nz-button type="button" (click)="close()">${4:关闭}</button>
    <button nz-button nzType="primary" [disabled]="f.invalid" [nzLoading]="http.loading">${5:保存}</button>
  </div>
</form>
```