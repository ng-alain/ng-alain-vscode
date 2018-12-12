---
description:
  zh-CN: CSS页头：右边表单组
  en-US: CSS of Header, Input group in right
---

```html
<div class="alain-default__content-title">
  <h1>$1</h1>
  <nz-input-group [nzCompact]="true">
    <nz-input [(ngModel)]="${4:val}"></nz-input>
    <button nz-button (click)="${3}" [nzLoading]="http.loading" [disabled]="!${4}">${2:切换}</button>
  </nz-input-group>
</div>
$0
```