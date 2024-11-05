---
title: 'SSE的前后端代码实现分享'
date: '2024-11-5'
tags: ["sse","nestjs",""]
draft: false
summary:
---

最近在做大模型相关项目，用到了SSE，主要流程是我的nestjs服务器进行鉴权，然后转发用户请求到通义千问接口，前端请求后显示。

先看看后端nestjs的sse接口代码
# 后端-SSE

nestjs提供了SSE能力，最简单代码如下，对应为文档在这里 https://docs.nestjs.com/techniques/server-sent-events#usage

## 简单输出

```js
import { interval, map, Observable } from 'rxjs';

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return interval(200).pipe(
      map((count) => ({
        data: `Message ${count}`, // 发送字符串内容
      })),
    );
  }
```













# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
