---
title: '开源js/ts脚本管理工具 playground.ts'
date: '2024-08-20'
tags: ['开源', 'playground.ts']
draft: false
summary:
---



# playground.ts

ts/js 游乐场


GitHub 地址 [https://github.com/ygweric/playground.ts](https://github.com/ygweric/playground.ts)


## playground.ts 是什么

playground.ts 是 js 和 ts 的 Playground，你可以随心所欲地编写 js/ts 脚本，并用 vscode 运行，它为你提供了最佳实践。

## 主要功能

1.  运行和调试 typescript 文件。
2.  运行和调试 javascript 文件。
3.  使用文件夹和 git 管理脚本。

## playground.ts 用来做什么？

我使用 playground.ts 来管理我的脚本，包括：

*   为一些网站或端点编写爬虫
*   编写或测试 js/ts 脚本
*   生成大量二维码
*   编写和练习 leetcode 算法
*   使用 Grammarly 和 Google Translate 将中文网站翻译成英文 (垃圾站)
*   使用 AI 分析数据
*   下载大量图片
*   等等。

## playground.ts 如何调试 typescript 文件？

一般情况下，我们需要运行 **tsc** 来将 typescript 文件编译为 javascript 文件，然后运行 ​​javascript 文件。

但是 playground.ts 集成了 **Jest**，你可以用 jest 来运行或调试 ts 文件。

## 所需环境

*   nodejs >= v18.20.1
*   推荐使用 pnpm，但 npm/yarn 也可以。
*   使用 **vscode** 来开发

### 安装

```sh
pnpm install
```

## 用法

### run/debug ts file

步骤如下:

**选择一个 ts 文件 -> Run and Debug -> Jest Current File**

![debug-ts-file-debug-sonsole.png](debug-ts-file-debug-sonsole.png)

![debug-ts-file-terminal.png](debug-ts-file-terminal.png)


### 运行 js 文件

你可以在终端中使用 node 命令运行 js 文件。

```sh
node src/template/2-js-template.js
node src/sample/3-base64String-to-png.js
```

### 调试 js 文件

步骤如下:
**S选择一个 js 文件 -> Run and Debug -> Run Current File**

您可以调试一个 js 文件。以下是屏幕截图

![debug-ts-file-terminal.png](debug-js-file-terminal.png)


## contribute

1.  Fork this repo
2.  Clone your forked repo
3.  Create a new branch
4.  Make your changes
5.  Commit your changes
6.  Push your changes
7.  Create a pull request

## License

MIT

## Author


国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)
# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生




