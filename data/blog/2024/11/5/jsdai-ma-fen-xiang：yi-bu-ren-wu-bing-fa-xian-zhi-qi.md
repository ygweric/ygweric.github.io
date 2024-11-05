---
title: 'js代码分享：异步任务并发限制器'
date: '2024-11-5'
tags: ["前端"]
draft: false
summary:
---



最近写爬虫，批量爬取网页，但又要限制下并发了，避免太占资源。

自己想了想js代码怎么写，发现还挺复杂的，后来索性咨询了ChatGPT，（ChatGPT的代码比通义的好很多），上代码。

代码如下，测试通过，但是代码我看不懂！！！

```js
export async function runWithConcurrencyLimit(tasks, limit) {
  const result = [];
  const executing = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(() => task()); // 包装为 promise 执行任务
    result.push(p);

    if (limit <= tasks.length) { // 默认边界检查，可以忽略
      const e = p.then(() => executing.splice(executing.indexOf(e), 1)); // 从队列中移除已完成任务 ---------- 这一行代码看不懂，e是谁？？
      executing.push(e);

      if (executing.length >= limit) { // 超过limit了
        // eslint-disable-next-line no-await-in-loop
        await Promise.race(executing); // 等待最先完成的任务
      }
    }
  }

  return Promise.all(result);
}
```

闲下来了，好好研究一番，看的更懵逼了。索性用**通义灵码**解释一番，竟然发现灵码还能生成流程图，帮助我理解，我觉得自己越来越菜了，动手能力越来越差。



下面着重理解下` executing.splice(executing.indexOf(e), 1))` 这个代码

# `executing.indexOf(e)`

```js
const e = p.then(() => executing.splice(executing.indexOf(e), 1)); // 从队列中移除已完成任务 ---------- 这一行代码看不懂，e是谁？？
```

## 问

> 上面代码中的“const e = p.then(() => executing.splice(executing.indexOf(e), 1));”不理解，e是返回的结果，为什么还可以用在indexOf中

## 答：

这行代码确实有些 tricky，让我们详细解释一下：


```js
const e = p.then(() => executing.splice(executing.indexOf(e), 1));
```

1. **`p` 是一个 Promise**：`p` 是通过 `Promise.resolve().then(() => task())` 创建的，表示一个异步任务的执行。
2. **`p.then(...)`**：当 `p` 这个 Promise 完成时（即任务执行完毕），会执行 `then` 方法中的回调函数。
3. **`const e`**：这里 `e` 是 `p.then(...)` 返回的新 Promise。这个新 Promise 在 `p` 完成后会被解析。
4. **`executing.splice(executing.indexOf(e), 1)`**：在 `p` 完成时，从 `executing` 数组中移除 `e`。

### 关键点

- **`e` 的作用**：`e` 是一个 Promise，它表示 `p` 完成后的状态。当 `p` 完成时，`e` 会被解析，并且 `executing` 数组中的 `e` 会被移除。
- **`executing.indexOf(e)`**：在 `p` 完成时，`e` 已经存在于 `executing` 数组中，因此 `executing.indexOf(e)` 可以找到 `e` 的索引位置。



## 总结
上面代码用了js的闭包功能，**闭包是指一个函数能够访问其外部作用域中变量的能力。即使外部函数已经执行完毕，内部函数仍然可以访问这些变量。** 又超出我的想象了。


# 代码流程图
![](Pasted%20image%2020241105182003.png)





# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
