---
description:
  zh-CN: OnPush 组件
  en-US: OnPush Component
---

```ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: '${1}',
  standalone: true,
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ${2}Component {
  private readonly http = inject(_HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  $0
}
```