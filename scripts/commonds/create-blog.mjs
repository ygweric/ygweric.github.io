import { input } from '@inquirer/prompts'
import pinyin from 'chinese-to-pinyin'
import path from 'path'
import fs from 'fs'

function ensureFileExists(filePath, fileContent = '') {
  const dirPath = path.dirname(filePath)

  // 确保目录存在
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // 确保文件存在
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
const tagsStr = await input({ message: 'Enter tags, split with comma (English or Chinese)' })
const tags = tagsStr.split(/[,，\s]/)

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

const basePath = process.cwd()
const dataBlogPath = 'data/blog'
const blogFilePath = path.join(
  basePath,
  // this script will be run either on root or "data/blog", so I need prevent duplicated path
  path.normalize(basePath).includes(path.normalize(dataBlogPath)) ? '' : dataBlogPath,
  String(year),
  String(month),
  String(date),
  `${fileName}.md`
)

// console.log(getMdxContent({ title, year, month, date, tags }))
// console.log(`blogFilePath: ${blogFilePath}`)

ensureFileExists(blogFilePath, getMdxContent({ title, year, month, date, tags }))
