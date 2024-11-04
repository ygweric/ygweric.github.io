---
title: windows通过虚拟机安装docker
date: 2024-10-30
tags:
  - docker
  - wsl
draft: true
summary:
---

在windows上面使用**docker desktop**, 但经常会出现问题，参考之前的博客[docker启动WSL错误解决-改用hyper-v引擎](../../8/29/qi-dong-cuo-wu-jie-jue.md)。

后来发现会经常各种莫名其妙的问题，防不胜防，解决一个又来一坨。

索性放弃，听从大家的意见，用wsl直接启动docker的方式

## wsl安装docker

但是过程并不顺利，通过**wsl install** 安装后，wsl命令进入ubuntu系统。

然后根据docker官网进行安装时候，始终提示源错误，各种方法（修改原也解决不了，报错如下。
```shell
Unable to find image 'hello-world:latest' locally
docker: Error response from daemon: Get https://registry-1.docker.io/v2/: dial tcp: lookup registry-1.docker.io on 192.168.65.1:53: no such host.
See 'docker run --help'
```









# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
