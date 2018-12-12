---
description:
  zh-CN: 模态框：查看模式
  en-US: Modal view mode demo
---

```html
<div class="modal-header">
  <div class="modal-title">$1</div>
</div>
<nz-spin *ngIf="!${2:i}" class="modal-spin"></nz-spin>
<sv-container *ngIf="$2">
  $0
</sv-container>
<div class="modal-footer">
  <button nz-button type="button" (click)="close()">关闭</button>
</div>
```