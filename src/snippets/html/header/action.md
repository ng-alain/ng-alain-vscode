---
description:
  zh-CN: 页头含操作区域
  en-US: Header include action area
---

```html
<page-header [action]="phAction">
  <ng-template #phAction>
    <button (click)="${2:add()}" nz-button nzType="primary">${1:新建}</button>
  </ng-template>
</page-header>
$0
```