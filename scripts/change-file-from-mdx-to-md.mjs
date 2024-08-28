import path from 'path'
import fs from 'fs'

function renameMdxToMd(dirPath) {
  // 读取目录内容
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err.message}`)
      return
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file)

      // 检查文件是否是目录
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats of file: ${err.message}`)
          return
        }

        if (stats.isDirectory()) {
          // 如果是目录，则递归调用
          renameMdxToMd(filePath)
        } else if (path.extname(file) === '.mdx') {
          // 如果文件扩展名是 .mdx，则重命名为 .md
          const newFilePath = path.join(dirPath, path.basename(file, '.mdx') + '.md')
          fs.rename(filePath, newFilePath, (err) => {
            if (err) {
              console.error(`Error renaming file: ${err.message}`)
            } else {
              console.log(`Renamed: ${filePath} -> ${newFilePath}`)
            }
          })
        }
      })
    })
  })
}

// 示例用法：指定要递归的目录路径
const directoryPath = path.join('data/blog')
renameMdxToMd(directoryPath)
