---
description:
  zh-CN: 携带 *ngIf
  en-US: Include *ngIf for ng-template
---

```html
<ng-template [ngTemplateOutlet]="${1:content}"${2: [ngTemplateOutletContext]="{ $implicit: ${3:item} \\}"}></ng-template>
$0
```