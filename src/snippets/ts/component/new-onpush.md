---
description:
  zh-CN: OnPush 组件
  en-US: OnPush Component
---

```ts
import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-${1}',
  templateUrl: './${1}.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${1}Component {
  constructor(private cdr: ChangeDetectorRef) {}
}
```