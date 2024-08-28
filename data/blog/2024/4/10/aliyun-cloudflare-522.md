---
title: '网站备案成功后，集成cloudflare的问题'
date: '2024-04-10'
tags: ['备案', '阿里云', 'cloudflare']
draft: false
summary:
---

cloudflare访问我的网站一直522，一位网站没有备案成功
![522](522.png)

等了一天还是不行，才意识到可能是别的问题。

来回查找，才发现阿里云的ESC默认没有开启 **80/443**端口。。。
