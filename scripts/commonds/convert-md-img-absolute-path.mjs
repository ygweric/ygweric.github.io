/* eslint-disable prettier/prettier */
import path from 'path'
import fs from 'fs'

// 递归遍历目录，查找所有 .md 文件
function findMdFiles(dir) {
  const files = fs.readdirSync(dir)
  let mdFiles = []

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      mdFiles = mdFiles.concat(findMdFiles(filePath))
    } else if (file.endsWith('.md')) {
      mdFiles.push(filePath)
    }
  })

  return mdFiles
}

// 替换相对路径为绝对路径
function replaceImagePaths(mdFile, originPath) {
  const content = fs.readFileSync(mdFile, 'utf8')
  const mdDir = path.dirname(mdFile).replace('data', '') // 获取 md 文件所在的目录
  console.log(mdDir)

  // const updatedContent = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, altText, imgPath) => {
  //   if (!imgPath.startsWith('http') && !path.isAbsolute(imgPath)) {
  //     // 将相对路径转换为绝对路径
  //     const absolutePath = `${originPath}/${imgPath}`
  //     return `![${altText}](${absolutePath})`
  //   }
  //   return match
  // })

  const updatedContent = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, altText, imgPath) => {
    if (!imgPath.startsWith('http') && !path.isAbsolute(imgPath)) {
      // 将相对路径转换为绝对路径
      // 使用 md 文件路径 + 原图片路径
      const absolutePath = `${originPath}/${mdDir}/${imgPath}`
        .replace(/\\/g, '/')
        .replace(/\/{2,}/g, '/') // 使用正斜杠拼接路径
      return `![${altText}](${absolutePath})`
    }
    return match
  })

  const newFileName = mdFile.replace(/\.md$/, '.absolute-path.md')
  fs.writeFileSync(newFileName, updatedContent, 'utf8')
  console.log(`Updated: ${mdFile}`)
}

// 主函数
function updateImagePathsInMdFiles(srcDir, originPath) {
  const mdFiles = findMdFiles(srcDir)

  mdFiles.forEach((mdFile) => {
    replaceImagePaths(mdFile, originPath)
  })

  console.log('All .md files updated.')
}

// 调用示例
const srcDir = './data/blog' // 替换为你的 src 目录
const originPath = 'https://guowei.fun/' // 替换为你的绝对路径前缀
updateImagePathsInMdFiles(srcDir, originPath)
