---
description:
  zh-CN: 页头完整模式
  en-US: Full header
---

```html
<page-header [title]="'$0'"
  [breadcrumb]="phBreadcrumb"
  [logo]="phLogo"
  [action]="phAction"
  [content]="phContent"
  [extra]="phExtra"
  [tab]="phTab"
>
  <ng-template #phBreadcrumb>面包屑</ng-template>
  <ng-template #phLogo>
    <div class="logo">logo</div>
  </ng-template>
  <ng-template #phAction>
    <div class="action">action</div>
  </ng-template>
  <ng-template #phContent>
    <div class="desc">content</div>
  </ng-template>
  <ng-template #phExtra>
    <div class="extra">extra</div>
  </ng-template>
  <ng-template #phTab>
    <nz-tabset nzSize="default">
      <nz-tab nzTitle="页签一"></nz-tab>
      <nz-tab nzTitle="页签二"></nz-tab>
      <nz-tab nzTitle="页签三"></nz-tab>
    </nz-tabset>
  </ng-template>
</page-header>
$0
```