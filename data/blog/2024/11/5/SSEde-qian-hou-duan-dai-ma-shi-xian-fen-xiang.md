---
title: 'SSE的前后端代码实现分享'
date: '2024-11-5'
tags: ["sse","nestjs",""]
draft: false
summary:
---

最近在做大模型相关项目，用到了SSE，主要流程是我的nestjs服务器进行鉴权，然后转发用户请求到通义千问接口，前端请求后显示。

先看看后端nestjs的sse接口代码


nestjs提供了SSE能力，最简单代码如下，对应为文档在这里 https://docs.nestjs.com/techniques/server-sent-events#usage

# 简单SSE输出

## 后端

返回`rxjs`的`interval` 循环输出内容

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


## 前端

前端很简单，只需要用`EventSource`来请求，直接监听`onmessage`内容即可，可以使用`close()`方法结束流。


```js
export async function fetchSSESimple(onMessage: (msg: string) => void) {
  const eventSource = new EventSource(`${beUrl}/hackathon/sse`);

  eventSource.onmessage = (event) => {
    // console.log('Received message:', event.data);
    if (onMessage) {
      onMessage(event.data);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
  };

  setTimeout(() => {
    eventSource.close();
  }, 30 * 1000);
}
```

# 转发通义的SSE接口（复杂）

## 后端 

下面是nestjs代码

`ForwardDto` 数据定义
```js
  export class ForwardDto {
  @ApiProperty({ description: '参数，为json格式', default: 'https://tongyi.aliyun.com' })
  targetUrl: string;

  @ApiProperty({ description: 'get|post', default: 'post' })
  method: string;

  @ApiProperty({ description: 'post的body，直接转发', default: '{}' })
  @IsNotEmpty()
  body: string;

  @ApiProperty({ description: 'header，为json格式，会转为对象', default: '{}' })
  @IsNotEmpty()
  header: string;
}
```

转发接口
```js


@Post('/forward-sse')
@Throttle(60, 10)
@ApiOperation({ summary: '转发解决跨域问题-SSE' })
@HttpCode(200)
async forwardSSE(@Body() dto: ForwardDto, @Res() res: Response): Promise<any> {
  try {
    let requestTask: any = null;
    if (dto.method.toLowerCase() === 'post') {
      requestTask = axios.post(dto.targetUrl, dto.body, {
        responseType: 'stream', // 确保我们以流的方式接收响应
        headers: {
          ...JSON.parse(dto.header),
          Accept: 'text/event-stream', // 确保我们请求的是 event-stream 格式
        },
      });
    }
    if (!requestTask) {
      return CustomError(`未知任务`);
    }
    const response = await requestTask;

    // 设置正确的 headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 将服务器的 event-stream 数据转发到客户端
    response.data.pipe(res);
  } catch (error) {
    return res.send(CustomError(`${error.message}\n${error.stack}`));
  }
}

```



## 前端
测试了很多方案，发现用**fetch**请求**post**的**SSE**是最合适的.

```js

export type FetchSseReturnType = {
  controller: AbortController;
};
export const fetchSSE = async (content: string, onMessage: (msg: string) => void, onFinished: () => void): Promise<FetchSseReturnType> => {
  const controller = new AbortController();

  fetch(`${beUrl}/forward-sse`, {
    signal: controller.signal,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({
      targetUrl: aecGptUrls.ragAppUrl,
      method: 'post',
      body: JSON.stringify({
        content,
        chatMode: 1,
        knowledges: getKnowledges(content),
        promptVariables: {},
        stream: true,
      }),
      header: JSON.stringify({
        'authorization': localStorage.getItem('AecGptToken'),
        'content-type': 'application/json',
      }),
      passcode,
    }),
  })
    .then((response: any) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      function read() {
        reader.read().then((res: any) => {
          const { done, value } = res;
          if (done) {
            console.log('Stream finished');
            if (onFinished) {
              onFinished();
            }
            return;
          }
          // 解码流数据
          const chunk = decoder.decode(value, { stream: true });

           // 处理 SSE 数据
           if (onMessage) {
            onMessage(chunk);
          }
          // 继续读取流
          read();
        });
      }

      read();
    })
    .catch((error) => {
      console.error('Error in POST SSE request:', error);
    });

  return { controller };
};
```





# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
