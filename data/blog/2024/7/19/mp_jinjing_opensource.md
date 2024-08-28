---
title: '开源一个日赚5毛的小程序【北漂开车指南】，欢迎star'
date: '2024-07-19'
tags: ['小程序', '开源']
draft: false
summary:
---


# 微信小程序源码 -  北漂开车指南外地车线路规划

# 介绍

同名微信小程序**北漂开车指南外地车线路规划**源码，移除线上接口，改为本地mock。

[GitHub代码地址 jinjing-route-plan-mp-opensource](https://github.com/ygweric/jinjing-route-plan-mp-opensource)

## 线上小程序功能

1.  智能规划线路，不收费，不限次数
2.  显示摄像头信息
3.  规避摄像头

![小程序二维码](mp_qr.png)
![小程序搜索结果](wx_search.png)

# 技术栈

Taro3 + Webpack5 + Vue3 + NutUI + TailwindCSS + Husky + json-server + 高德LBS接口

# 功能亮点

*   **位置选择**， 个人开发者无法使用微信自带的位置选择功能，所以需要自己实现

# 技术亮点

*   **点位重叠算法**： 线路、摄像头是否重叠
*   微信小程序**自动发布**
*   nonce 防重放

# 运行

## 开发环境

*   **nodejs** >= **18.x**
*   推荐**pnpm**， 运行更迅速， **npm**，**yarn** 也行，但我没有测试
*   最新的**微信开发者工具**

## 配置key

1.  配置高德地图key
    1.  [创建高德key](#创建高德key)
    2.  复制 **.private-keys.example.ts** 为 **.private-keys.ts**
    3.  复制刚才的高德key到 **.private-keys.ts** 对应变量中

2.  配置小程序代码上传密钥
    1.  [创建小程序代码上传密钥](#创建小程序代码上传密钥)
    2.  复制刚才的key到 **ci-private.jinjing.key** 中

## 启动命令

    pnpm install # 安装依赖
    pnpm run server # 启动mock服务，端口好3000
    pnpm run dev #启动小程序

**微信开发者工具**导入项目，选择根目录即可，可以看到结果。

## 代码规范

**强制使用huksy**来格式化代码，避免不同机器上vscode配置不同导致代码格式不统一
如果husky提交有问题，可以先注临时释掉 **.husky\pre-commit**, 提交成功后再关闭注释

# 预览

![小程序首页](screenshots/demo_home_load_1.gif)
![摄像头列表、评论](screenshots/demo_camera_detail_list-2.gif)
![位置选择](screenshots/demo_choose_location_3.gif)
![默认路线](screenshots/demo_route_general_4.gif)
![智能规划路线](screenshots/demo_route_avoid_5.gif)



# 贡献代码

*   欢迎提issue
*   欢迎提pr



## 开发群

 [加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)


# 开发问题记录

*   **pnpm run dev**时候，**components.d.ts**会被一直编译，导致**lint-staged**反复失败，可以手动**git add** 所有文件（除了**components.d.ts**）
*   **run build:weapp** 的**NODE\_ENV**是生产，但**run build:weapp -- -- watch**就又是开发了，不过代码会压缩
*   小程序需要使用**crypto-js\@3.3.0**，因为v4使用了原生的nodejs的random函数，小程序不支持

# 创建key

## 创建高德key

[高德后台](https://console.amap.com/dev/key/app)->我的应用->添加Key->服务平台:Web服务->确认->复制key



![高德LBS接口key-1](get_amap_lbs_key_1.png)
![高德LBS接口key-2](get_amap_lbs_key_2.png)

## 创建小程序代码上传密钥

[小程序后台](https://mp.weixin.qq.com/)->开发管理->开发设置->小程序代码上传->小程序代码上传密钥



![小程序代码上传密钥](get_mp_upload_secretkey.png)

# [加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)
