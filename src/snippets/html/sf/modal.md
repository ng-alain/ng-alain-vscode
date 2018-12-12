---
description:
  zh-CN: 动态表单：模态页示例
  en-US: Modal demo for sf
---

```html
<sf #sf mode="edit" [schema]="schema" [ui]="ui" [formData]="$1" button="none">
  <div class="modal-footer">
    <button nz-button type="button" (click)="close()">关闭</button>
    <button nz-button type="submit" [nzType]="'primary'" (click)="save(sf.value)" [disabled]="!sf.valid" [nzLoading]="http.loading">保存</button>
  </div>
</sf>
```