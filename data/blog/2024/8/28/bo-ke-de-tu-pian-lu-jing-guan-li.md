---
title: 'next.js博客的图片路径管理'
date: '2024-8-28'
tags: ["next.js","markdown"]
draft: false
summary:
---



用next.js书写的markdown博客应用，遇到以下问题。

markdown的文件目录在 **/data/blog/** 里面，但next.js的静态文件目录在 **/public/**  中，

markdown文件是可以在vscode中预览时候的路径是相对路径，是找不到public目录下面的内容的。

每次写博客，都需要启动服务才能看到效果，验证是否正确。

其实我大部分写的博客的内容，比较简单，大部分是生活随笔，技术随笔，但不需要在本地验证，只需要把它推到**github pages**上面就可以了，所以我希望能在本地书写报告的时候可以直接预览。

其实我还是希望把图片放到markdown的相同目录里边，而不是放在**public**中。 但在github page编译发布的时候，必须放在 **public**  中。 

此我需要一个脚本能够自动同步图片到public里边。

下面就是我的代码 **syncBlogImagesToPublic.js**


```js
import syncDirectory from 'sync-directory'

export const syncBlogImagesToPublic = (watch = true) => {
  const srcDir = './data/blog/'
  const targetDir = './public/blog/'
  syncDirectory(srcDir, targetDir, {
    watch,
    exclude: [/.*(md|mdx)$/i],
  })
}
```


我只需要在程序启动的时候，或者在程序build的时候去运行这个脚本。

中间有一个参数是**watch**,是判断文件的修改并及时同步。dev时候，如果有修改就自动同步。

build的时候就是false，不需要同步，只需要复制一次就行。

[具体的文件链接在这里。](https://github.com/ygweric/ygweric.github.io/blob/main/scripts/syncBlogImagesToPublic.mjs)


下面这张图片就是图片同步功能下的一个用例
![](Pasted%20image%2020240828184848.png)



# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
