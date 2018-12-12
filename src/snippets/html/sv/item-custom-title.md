---
description:
  zh-CN: 查看：自定义标签标题
  en-US: Custom title for sv
---

```html
<sv [label]="${1:idLabelTpl}">
  <ng-template #${1}>
    <a nz-tooltip="test">tip</a>
    $0
  </ng-template>
</sv>
```