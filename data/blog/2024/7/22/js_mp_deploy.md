---
title: '一个脚本，自动打包发布小程序'
date: '2024-07-22'
tags: ['小程序', '前端工程化']
draft: false
summary:
---


发布小程序代码时候，使用微信开发工具自带的发布功能也不是不行。

![img](1.png)

但可能**遇到以下问题**：

1. 版本号无法自动更新，项目复杂时候，版本号还是很重要的
2. 项目备注只有一个时间，如果能自动集成git的log，岂不是非常棒？
3. 需要等待10秒左右，在此期间没法干别的工作
4. 多人协同，会有多个开发者账号，上传的预览版会来回切换，很麻烦，这单多人协作的都知道。
5. 如果使用Taro、mpvue等框架开发时候，还有一个development和product的编译过程，发布时候需要用product模式编译一遍，会影响本地正在开发的状态。

这个自动打包发布的脚本，**能完美解决这些问题**！

先看代码：


**env.mjs**
```js
const common = {
    server: 'local', // local|test|prod
    mode: 'dev', // dev|prod
  }
  export default common
  
```

**start-ci.mjs**
```js 
import  env from "./env.mjs";
import ci from "miniprogram-ci"; 
import * as fs from 'fs'

console.log(`env: ${JSON.stringify(env)}`)

/* 项目配置 */
const  projectConfig  = JSON.parse(fs.readFileSync('./project.config.json', 'utf-8')) 
const  packageConfig  = JSON.parse(fs.readFileSync('./package.json', 'utf-8')) 

// new ci实例
const project = new ci.Project({
  appid: projectConfig.appid,
  type: 'miniProgram',
  projectPath: './dist-prod', // projectConfig.miniprogramRoot,
  privateKeyPath: './ci-private.jinjing.key',
  ignores: [

  ]
})

/** 上传 */
async function upload () {
  const uploadResult = await ci.upload({
    project,
    version: packageConfig.version,
    desc: `Jenkins自动发布 at ${new Date()}`,
    setting: {
    },
    onProgressUpdate: console.log
  })

  console.log('>>>>>>> uploadResult: ', uploadResult)
}

/** 入口函数 */
// 这里使用setTimeout，是为了在里面使用async/await功能
setTimeout(async () => {
  try {
    // 上传
    await upload()// 上传前打包
  } catch (error) {
    console.error('>>>>>>> error: ', error)
    process.exit(1)
  }
}, 0)

```

## 代码解释
[miniprogram-ci](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html) 是微信官方提供的打包工具。

**env.mjs**是我配置不同环境和接口的文件，别的项目可以使用**process.env**来判断(**nextjs**就是使用这种方式),但是不够灵活。

发布时候使用**setTimeout（xx,0)**，可以方便在函数里面使用async/await功能

**const project = new ci.Project** 是配置项目对象的相关信息，包括小程序id、项目路径、上传密钥路径、忽略文件等，详细[文档在这里](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#%E9%A1%B9%E7%9B%AE%E5%AF%B9%E8%B1%A1)

键           | 类型   | 说明                                                                |
| ----------- | ---- | ----------------------------------------------------------------- |
| appid       | 属性   | 小程序/小游戏项目的 appid                                                  |
| type        | 属性   | 项目的类型，有效值 miniProgram/miniProgramPlugin/miniGame/miniGamePlugin   |
| projectPath | 属性   | 项目的路径，即 project.config.json 所在的目录                                 |
| privateKey  | 属性   | 私钥，在获取项目属性和上传时用于鉴权使用，在 [微信公众平台](https://mp.weixin.qq.com/) 上登录后下载 |
| attr        | 异步方法 | 项目的属性，如指定了 privateKey 则会使用真实的项目属性                                 |
| stat        | 同步方法 | 特定目录下前缀下（prefix）文件路径 (filePath) 的 stat, 如果不存在则返回 undefined        |
| getFile     | 异步方法 | 特定目录下前缀下（prefix）文件路径 (filePath) 的 Buffer                          |
| getFileList | 同步方法 | 特定目录下前缀下（prefix）文件路径 (filePath) 下的文件列表                            |
| updateFile  | 同步方法 | 更新项目文件

**const uploadResult = await ci.upload** 是配置上传信息，包括版本号、版本描述、上传进度监听、机器人名称、编译线程数等，详细文档[在这里](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#%E4%B8%8A%E4%BC%A0)

键                | 类型       | 必填 | 说明                        |
| ---------------- | -------- | -- | ------------------------- |
| project          | IProject | 是  | #项目对象                     |
| version          | string   | 是  | 自定义版本号                    |
| desc             | string   | 否  | 自定义备注                     |
| setting          | object   | 否  | #编译设置                     |
| onProgressUpdate | function | 否  | 进度更新监听函数                  |
| robot            | number   | 否  | 指定使用哪一个 ci 机器人，可选值：1 ~ 30 |
| threads          | number   | 否  | 指定本地编译过程中开启的线程数


## 小程序上传密钥生成
[小程序后台](https://link.juejin.cn/?target=https%3A%2F%2Fmp.weixin.qq.com%2F "https://mp.weixin.qq.com/")->开发管理->开发设置->小程序代码上传->小程序代码上传密钥

![img](2.png)

## 这个脚本怎么用
1. 保存刚才的**start-ci.mjs**到项目根目录
2. 修改对应参数为你的小程序信息
3. 下载小程序密钥到根目录
4. **package.json**添加scripts命令：
```
"deploy": "node ./start-ci.mjs",
```
5. 运行**npm run deploy**，就能发布到小程序后台了。
6.微信后台能看到对应信息。

![img](3.png)

相关实践在开源项目[微信小程序：查看进京证摄像头分布和信息，智能规划线路，避让摄像头，适合短距离出行](https://github.com/ygweric/jinjing-route-plan-mp-opensource)中有使用。

# 下一篇
下一篇文章聊一下怎么能自动更新版本信息等内容，欢迎点赞关注

 [加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)
  





