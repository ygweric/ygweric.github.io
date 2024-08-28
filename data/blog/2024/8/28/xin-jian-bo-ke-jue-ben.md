---
title: '自动新建博客脚本'
date: '2024-8-28'
tags: ['script', 'blog']
draft: false
summary:
---


我的博客的技术栈是 **markdown + next.js + github page**。下面是我的博客的模板，

```
 ---

title: '新建博客脚本'

date: '2024-8-28'

tags: ["script","blog"]

draft: false

summary:
---

# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容
```

可以看到， 每次新建博客的时候都需要手动添加日期，创建md的文件名，创建tags等固定内容，非常麻烦，因此我想着要有一个脚本能够自动实现这些过程。所以我就写了一个脚本。

线上代码**x**, [github的地址在这里](https://github.com/ygweric/ygweric.github.io/blob/main/scripts/commonds/create-blog.mjs)

```js
import { input } from '@inquirer/prompts'

import pinyin from 'chinese-to-pinyin'

import path from 'path'

import fs from 'fs'

function ensureFileExists(filePath, fileContent = '') {
  const dirPath = path.dirname(filePath) // 确保目录存在

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  } // 确保文件存在

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, fileContent)
  }
}

function isNumberBetween(str, from, to) {
  const num = Number(str)

  return /^\d+$/.test(str) && num >= from && num <= to
}

function isDayOfMonth(str) {
  // 判断是否为纯数字且在1到31之间

  const num = Number(str)

  return /^\d+$/.test(str) && num >= 1 && num <= 31
}

const getMdxContent = ({ title, year, month, date, tags }) => `---

title: '${title}'

date: '${year}-${month}-${date}'

tags: ${JSON.stringify(tags)}

draft: false

summary:

---

  

# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容

# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容

# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容

# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容

  

# 关于我

国 wei (Eric)

[Github](https://github.com/ygweric)

  

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

  

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生

`

const title = await input({ message: 'Enter blog title', validate: (val) => !!val })

const tagsStr = await input({ message: 'Enter tags, split with comma' })

const tags = tagsStr.split(',')

const fileName = await input({
  message: 'Enter file name',

  default: pinyin(title, { removeTone: true }).replace(/\s+/gi, '-'),
})

const year = await input({
  message: 'Enter year',

  default: new Date().getFullYear(),

  validate: (val) => isNumberBetween(val, 2020, 2080),
})

const month = await input({
  message: 'Enter month',

  default: new Date().getMonth() + 1,

  validate: (val) => isNumberBetween(val, 1, 12),
})

const date = await input({
  message: 'Enter date',

  default: new Date().getDate(),

  validate: (val) => isNumberBetween(val, 1, 31),
})

// data\blog\2024\8\8

const blogFilePath = path.join(
  'data/blog',

  String(year),

  String(month),

  String(date),

  `${fileName}.md`
)

console.log(getMdxContent({ title, year, month, date, tags }))

ensureFileExists(blogFilePath, getMdxContent({ title, year, month, date, tags }))
```

上面的**ensureFileExists**是我用ChatGPT写的，算是一把过，比较不错。

VSCode也使用了通义灵码产检，节省了不少时间。

上面的代码有两个比较有意思的要点，

1. 使用**chinese-to-pinyin**转化中文博客名称为拼音，最为markdown的文件名，看起来比总问的markdown文件名稍微规范点。
2. 使用**inquirer**来让用户（我）在命令行输入文件名，tags，日期等内容，交互算是比较好的。

下面是创建博客的命令结果

```shell

$ npm run create

> tailwind-nextjs-starter-blog@2.2.0 create
> node scripts/commonds/create-blog.mjs

? Enter blog title 新建博客内容
? Enter tags, split with comma blog,vite
? Enter file name xin-jian-bo-ke-nei-rong
? Enter year 2024
? Enter month 8
? Enter date 29
---
title: '新建博客内容'
date: '2024-8-29'
tags: ["blog","vite"]
draft: false
summary:
---

# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容
# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容
# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容
# 这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容，这里写博客内容

# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生

```

![](Pasted%20image%2020240828190748.png)

# 关于我

国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
