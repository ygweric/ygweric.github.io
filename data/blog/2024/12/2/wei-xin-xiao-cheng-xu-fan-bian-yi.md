---
title: 微信小程序反编译记录
date: 2024-12-2
tags: 
draft: false
summary:
---

最近小程序接口被盗，频繁的请求接口。

之前在接口中加了nonce来防止攻击，但是代码没有混淆。

今天就直接来演技下小程序此反编译。


## 逆向软件
下载地址 [反编译脚本利器.zip](https://github.com/ygweric/test-files/blob/master/%E5%8F%8D%E7%BC%96%E8%AF%91%E8%84%9A%E6%9C%AC%E5%88%A9%E5%99%A8.zip)





## 小程序代码位置

打开下面的这个地址

![](Pasted%20image%2020241202145824.png)


直接打开的文件夹不是很对，需要往上层目录找，找到有**All Users**和**Applet**的目录，进去**Applet**,
![](Pasted%20image%2020241202145904.png)

打开一个小程序，（已经有的可以删除，避免混乱）可以看到有文件夹生成，就是你的小程序的文件
![](Pasted%20image%2020241202150134.png)


进去以后能找到对应的 **__APP__.wxapkg** ,如果有子包，也会有对应文件，这个文件就是我们要破解的文件。

![](Pasted%20image%2020241202150207.png)

## 破解 wxapkg
打开**反编译脚本利器\小程序包解密工具** 这个软件，选择对应的**wxapkg**文件，

![](Pasted%20image%2020241202150426.png)

然后回看到破解成功，破解后的地址在**反编译脚本利器\小程序包解密工具\wxpack**
![](Pasted%20image%2020241202150522.png)


### 未加密

如果是体验版小程序（自测）时候，会提示没有加密。后面可以直接提取文件，一会说。
![](Pasted%20image%2020241202150647.png)










## 从 wxapkg提取小程序原生文件

复制解密后的**wxapkg** 到**反编译脚本利器\wxappUnpacker-master** 目录中。

























# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
