---
description:
  zh-CN: 模板递归树
  en-US: Recursive tree for ng-template
---

```html
<ng-template #treeTpl let-ls let-level="level">
  <li *ngFor="let i of ls">
    <ul *ngIf="i.children.length > 0">
      <ng-container *ngTemplateOutlet="treeTpl; context:{ $implicit: i.children, level: level + 1 }"></ng-container>
    </ul>
  </li>
</ng-template>
<ul>
  <ng-container *ngTemplateOutlet="treeTpl; context:{ $implicit: tree.children, level: 1 }"></ng-container>
</ul>
```