---
title: learn-browser-use
date: 2025-1-16
tags: 
draft: true
summary:
---

分析一下一个NB的开源库 [**browser-use**](地址https://github.com/browser-use/browser-use)，能自动在浏览器执行

地址 https://github.com/browser-use/browser-use

下面是分析随笔，不是具体的详细教学，毕竟也没有经历去详细写长篇大论。


## 原理简介
browser-user使用大模型来理解网页dom元素内容，辅助视觉大模型理解网页，并自动点击，下面是它使用的几个工具介绍:
* 用playwright来操作网页， 包括：打开tab、点击屏幕按钮or某个元素、输入内容、网页截图、解析网页dom元素
* 大模型：接受任务、理解网页元素内容，根据前面的任务任务记忆，来返回下一步执行的命令。


## 大模型对话分析


### system prompt







## 代码分析

















































# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
