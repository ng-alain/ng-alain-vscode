---
description:
  zh-CN: 标签选择器
  en-US: Tag select
---

```html
<tag-select>
  <nz-tag *ngFor="let ${2:i} of ${1:categories}; let idx = index"
    nzMode="checkable" [(nzChecked)]="${2}.value" (nzCheckedChange)="change(${2})">{{${2}.text}}</nz-tag>
</tag-select>
```