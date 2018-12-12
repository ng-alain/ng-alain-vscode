---
description:
  zh-CN: 动态表单：页面示例
  en-US: Page dem for sf
---

```html
<sf #sf mode="edit" [schema]="schema" [ui]="ui" [formData]="$1" button="none">
  <footer-toolbar>
    <button nz-button type="submit" nzType="primary" (click)="save(sf.value)" [disabled]="!sf.valid" [nzLoading]="http.loading">保存</button>
  </footer-toolbar>
</sf>
```