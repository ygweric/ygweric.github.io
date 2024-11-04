---
title: windows通过虚拟机安装docker
date: 2024-10-30
tags:
  - docker
  - wsl
draft: false
summary:
---

在windows上面使用**docker desktop**, 但经常会出现问题，参考之前的博客[docker启动WSL错误解决-改用hyper-v引擎](../../8/29/qi-dong-cuo-wu-jie-jue.md)。

后来发现会经常各种莫名其妙的问题，防不胜防，解决一个又来一坨。

索性放弃，听从大家的意见，用wsl直接启动docker的方式

## wsl安装docker

但是过程并不顺利，通过**wsl install** 安装后，wsl命令进入ubuntu系统。

然后根据docker官网进行安装时候，始终提示源错误，各种方法（修改源、加代理）也解决不了，报错如下。
```shell
Unable to find image 'hello-world:latest' locally
docker: Error response from daemon: Get https://registry-1.docker.io/v2/: dial tcp: lookup registry-1.docker.io on 192.168.65.1:53: no such host.
See 'docker run --help'
```

索性放弃该方法，改用更简单的**virtual box + docker**的方式

部分测试过程记录如下：
### apt-get源

1. 修改**apt-get的**源

```Shell
yanggw@yanggw-P5:/mnt/c/Users/yanggw$ cat /etc/apt/sources.list
deb https://mirrors.cloud.tencent.com/ubuntu/ jammy main restricted universe multiverse
deb-src https://mirrors.cloud.tencent.com/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ jammy-security main restricted universe multiverse
deb-src https://mirrors.cloud.tencent.com/ubuntu/ jammy-security main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ jammy-updates main restricted universe multiverse
deb-src https://mirrors.cloud.tencent.com/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ jammy-proposed main restricted universe multiverse
deb-src https://mirrors.cloud.tencent.com/ubuntu/ jammy-proposed main restricted universe multiverse
deb https://mirrors.cloud.tencent.com/ubuntu/ jammy-backports main restricted universe multiverse
deb-src https://mirrors.cloud.tencent.com/ubuntu/ jammy-backports main restricted universe multiverse
```

2. 修改**apt-get**获取docker的源

```Shell
yanggw@yanggw-P5:/mnt/c/Users/yanggw$ cat /etc/apt/sources.list.d/docker.list
deb https://mirrors.aliyun.com/docker-ce/linux/debian stretch stable
```

## virtual box + docker

使用virtual box，是因为他开源免费，在公司环境使用没有什么后顾之忧，**vmware**的个人版本也是可以的，但据说会占用更多的资源。

这种方式成功了，下面记录一下部分修改，免得重走弯路。

  

### 网络

1. 桥接网卡-hyper-v，这样才能ping通

![](https://zct85ce4jm.feishu.cn/space/api/box/stream/download/asynccode/?code=MmE2NzFlZWQ2NjMyZTUyYjgxYWU2MTQ5NmE0OWNmNzhfSjJFNlhFcnpNYmZjT3BvWE1mWEhkNEp2alFhaHJQYjZfVG9rZW46WVYxcWJlQ0lqb2I4WHR4RHdUZGNscERUbmREXzE3MzA3MDEyODA6MTczMDcwNDg4MF9WNA)

  

2. 安装ssh，才能ssh登录

```Shell
sudo apt install openssh-server
```

  

### 宝塔
这里强烈推荐非专业运行同学使用宝塔，真的太方便了，有UI方便操作，而且占用的资源也不多。
  
安装成功如下
```Shell
Congratulations! Installed successfully!
=============注意：首次打开面板浏览器将提示不安全=================

 请选择以下其中一种方式解决不安全提醒
 1、下载证书，地址：https://dg2.bt.cn/ssl/baota_root.pfx  双击安装,密码【www.bt.cn】
 2、点击【高级】-【继续访问】或【接受风险并继续】访问
 教程：https://www.bt.cn/bbs/thread-117246-1-1.html
 mac用户请下载使用此证书：https://dg2.bt.cn/ssl/baota_root.crt

========================面板账户登录信息==========================

 【云服务器】请在安全组放行 23552 端口
 外网面板地址: https://219.141.248.147:23552/4311113
 内网面板地址: https://172.25.39.159:23552/436111313
 username: xz1115t
 password: 011157e

 浏览器访问以下链接，添加宝塔客服
 https://www.bt.cn/new/wechat_customer
```






# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
