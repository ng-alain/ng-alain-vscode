---
description:
  zh-CN: 编辑：HTML帮助
  en-US: Help html for se
---

```html
<se [label]="${1:type}LabelTpl">
  <ng-template #${1}LabelTpl>
    <label>
      $2
      <nz-popover [nzContent]="${1}HelpTpl">
        <ng-template #${1}HelpTpl>
          $3
        </ng-template>
        <i nz-popover nz-icon type="question-circle"></i>
      </nz-popover>
    </label>
  </ng-template>
  $0
</se>
```