---
description:
  zh-CN: 查看：货币示例
  en-US: Currency demo for sv
---

```html
<sv label="${1|单价,金额,订单金额,支付金额,市场价|}">{{ ${2:i.price} | _currency }}</sv>
$0
```