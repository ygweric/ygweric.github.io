---
title: 掘金推荐文章高频词分析
date: 2024-11-12
tags:
  - 爬虫
  - python，js
draft: false
summary:
---

最近做大模型、爬虫比较上头，但发掘金的文章一直不温不火，同时也感觉掘金的硬核文章页越来越少，噱头越来越多。索性就分析下我的文章推荐流中到底有什么特点。

首先手动截取了我的首页推荐文章的地址和标题，保存为json如下,下面只显示了部分内容，总共有1358条数据，是首页数据流下拉100次左右的结果。

```json
[
    {
        "pageContentUrl": "https://juejin.cn//post/7419148660796293139",
        "pageContentTitle": "实现敏感字段脱敏注解@Sensitive"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7370682998990553100",
        "pageContentTitle": "终于拿到了 WXG 的 offer，却只能无奈放弃 🥺"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7320102376174862346",
        "pageContentTitle": "我的2023，被裁员"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7398091377663836200",
        "pageContentTitle": "汗流浃背的45分钟--上海某公司一面"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7367275063873470502",
        "pageContentTitle": "房车用了两年多，这个油耗我是没有想到的"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7400253623790272547",
        "pageContentTitle": "面试必问，防抖函数的核心是什么？"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7366567675315126281",
        "pageContentTitle": "从20k到50k再到2k，聊聊我在互联网干前端的这几年"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7419954652684632083",
        "pageContentTitle": "typeof 的三大奇观"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7299849645206781963",
        "pageContentTitle": "【Vue3】如何封装一个超级好用的 Hook ！"
    },
    ...其余1300+条数据
]
```


下面要考虑是否分析文章的内容的问题，还是只分析标题。

标题是最重要的，索性从标题开始吧，将上面json内容的标题转换为txt文件，供后面分析。

标题的纯txt文件也有3万字，72kb了。妥妥一个中篇小说。

![](Pasted%20image%2020241112114243.png)


然后上python代码，进行词频分析。


































# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
