---
description:
  zh-CN: 构建编辑完整示例
  en-US: A full edit demo
---

```ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

const URL = '/';

@Component({
  selector: 'app-${1}-edit',
  templateUrl: './edit.component.html',
})
export class ${2}EditComponent implements OnInit {
  i: any = {
    id: 0
  };

  constructor(
    public http: _HttpClient,
    private msg: NzMessageService,
    private modalRef: NzModalRef,
  ) {}

  ngOnInit() {
    if (this.i.id > 0) {
      this.http
        .get(`${URL}/${this.i.id}`)
        .subscribe((res: any) => (this.i = res));
    }
  }

  save() {
    this.http.post(URL, this.i).subscribe(res => {
      this.msg.success('Success');
      this.modalRef.close(res);
    });
  }

  close() {
    this.modalRef.close();
  }
}
```