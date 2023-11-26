---
description:
  zh-CN: OnPush 组件
  en-US: OnPush Component
---

```ts
import { Component, inject } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: '${1}',
  standalone: true,
  template: ``
})
export class ${2}Component {
  private readonly http = inject(_HttpClient);

  $0
}
```