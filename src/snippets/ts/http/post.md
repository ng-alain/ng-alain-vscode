---
description:
  zh-CN: HTTP请求：提交
  en-US: Post http request
---

```ts
this.http.post(${1:this.url}, this.${2:i}).subscribe((res: any) => {
  this.msgSrv.success('保存成功');
  this.modal.close(true);
});
```