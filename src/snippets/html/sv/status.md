---
description:
  zh-CN: 查看：状态示例
  en-US: Status demo for sv
---

```html
<sv label="状态">
  <nz-badge *ngIf="i.status === 1" nzStatus="default" nzText="未提交"></nz-badge>
  <nz-badge *ngIf="i.status === 2" nzStatus="processing" nzText="运行中"></nz-badge>
  <nz-badge *ngIf="i.status === 4" nzStatus="warning" nzText="上线审核中"></nz-badge>
  <nz-badge *ngIf="i.status === 6" nzStatus="error" nzText="已删除"></nz-badge>
  $0
</sv>
```