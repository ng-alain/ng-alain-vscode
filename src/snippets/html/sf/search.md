---
description:
  zh-CN: 动态表单：搜索模式
  en-US: Search demo for sf
---

```html
<sf mode="search" [schema]="${1:searchSchema}" [formData]="${2:params}" (formSubmit)="${3:st}.reset($event)" (formReset)="$3.reset($2)"></sf>
```