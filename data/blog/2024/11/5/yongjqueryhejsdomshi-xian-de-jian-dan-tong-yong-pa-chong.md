---
title: '用jquery和jsdom实现的简单通用爬虫'
date: '2024-11-5'
tags: ["爬虫","jquery"]
draft: false
summary:
---
 
# 背景

在项目中使用了大模型，但大模型有幻觉问题，需要通过bing搜索的结果来交叉确认大模型的正确性。

bing接口使用的是bing官方的免费api，1千次每月。接下来要实现的就是写一个爬虫，获取bing结果网页中的内容。爬虫的要求如下：

* 这个内容不需要太精确，只需要提取出正文内容，传给大模型即可。
* 不需要考虑对应网站的反爬策略，不让爬取就直接忽略，只需要有一半左右的链接能爬取有结果即可。

最后的代码在最后面，这中间想着重介绍几个小点

# 核心要点
## 1. 对网页编码进行正确判断

网页有gbk、utf8等不同编码，需要判断，否则乱码，用的是**iconv**来解码
```js
  let res_ = "";
  try {
    const response = await axios.get(pageContentUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36`,
      },
    });
    // res_ = iconv.decode(response.data, "gbk");
    const tmpRes = iconv.decode(response.data, "utf-8");
    const dom = new JSDOM(tmpRes);

    const encoding = getHtmlEncoding(tmpRes) || "utf-8";

    res_ = iconv.decode(response.data, encoding);
  } catch (err) {
    console.error(err.message);
    // throw err;
    errorInfoStr += `\n${err.message}`;
  }
  const htmlString = String(res_);

```


## 2. 精确正文选择器

由于bing搜索结果，大部分是百家号、腾讯新闻、知乎、官网等信息，所以可以多找些真是数据，找出对应的选择器写死即可，然后循环，找到一个即是最后结果

```js
const getExplicitMatchedContent = ($) => {
  const contentSelectors = [
    `[data-role="paragraph"]`, // https://new.qq.com/rain/a/20241016A08CP400
    "article",
    ".article",
    ".detail-content",
    ".content-article",
    ".article-content",
    ".main",
    ".content",
    ".index_centent",
    `[data-testid="article"]`, //百家号 https://baijiahao.baidu.com/s?id=1730584141402361753
  ];

  let maxContent = null;
  let maxSelector = null;

  for (let i = 0; i < contentSelectors.length; i++) {
    const selector = contentSelectors[i];
    const contentText = $(selector).first().text().trim();
    if (contentText.length > 50) {
      maxContent = contentText;
      maxSelector = `$(${selector}).first().text().trim()`;
      break;
    }
  }
  return {
    content: maxContent,
    selector: maxSelector,
  };

  // return extractMaxContent($, contentSelectors, { limitedElementCount: 1 });
};
```



## 3. 模糊（通用）正文选择器

对于其他未精确匹配的网站，可以使用一套模糊选择器，匹配**article**，**content**，**main**等内容，然后循环对比，找出内容最长的节点即可。

这里可以做下改进，进一步判断or移除节点中的js、css、无效内容，来对比的更准确

```js
/**
 * 模糊匹配标签
 * @param {*} $
 * @returns
 */
const getImplicitMatchedContent = ($) => {
  // 定义可能包含正文的常见标签
  const contentSelectors = [
    ".article", // 常见的正文标签
    'div[class*="content"]',
    'div[class*="article"]',
    'div[id*="content"]',
    'div[id*="article"]',
    "main", // 网页主要内容的标签
    "section", // 可能包含正文的标签
    "p", // 段落
  ];

  return extractMaxContent($, contentSelectors, {
    extraDiscardFn: (currentContent) => {
      // const withTooManyBlank = hasConsecutiveBlanks(currentContent, 5, 5); // 判断是否太多空白字符，表示选择的范围太大了，包括了太多导航栏啥的
      const consecutiveBlanksCount = countConsecutiveBlanksGreaterThanN(
        currentContent,
        5
      ); // 判断是否太多空白字符，表示选择的范围太大了，包括了太多导航栏啥的

      console.log(`连续空白字符个数：${consecutiveBlanksCount},`);

      const withTooManyBlank = consecutiveBlanksCount > 10;
      return withTooManyBlank;
    },
  });
};
```



# 进一步优化

可以做下面优化（能做，但我估计懒得改进了）
1. 针对不同网站设置header、cookie，最大限度绕过反爬虫机制
2. 针对不同网站设置不同的选择器
3. 加入NLP等ai手段获取更正确的正文

# 爬虫结果

最终效果如下图，看着还行，比较干净
![](Pasted%20image%2020241105150139.png)
# 最终js文件

```js
/**
 * 针对bing的爬虫，直接提取SEO友好的页面标题、内容
 */

import fs from "fs";
import dayjs from "dayjs";
import { JSDOM } from "jsdom";
import jquery from "jquery";
import axios from "axios";
import iconv from "iconv-lite";
import * as path from "path";
import { JSONFilePreset } from "lowdb/node";
import {
  countConsecutiveBlanks,
  countConsecutiveBlanksGreaterThanN,
  createDirectorySync,
  createFileIfNotExist,
  delay,
  getHtmlEncoding,
  hasConsecutiveBlanks,
  sanitizeFileName,
  extractMaxContent,
  isDomainOnly,
  splitStringIntoChunks,
} from "./utils.js";

// const settingFilePath = `./res/llm/bing/settingDb.json`;
const resultUrlsPath = `./res/llm/bing/urls.json`;
const pageContentFolderPath = `./res/llm/bing/single-file-page-content/${dayjs().format(
  "DD_HH-mm-ss/"
)}`;
const jsonlFilePath = `./res/llm/bing/jsonl/${dayjs().format(
  "DD_HH-mm-ss"
)}.jsonl`;

let errorInfoStr = "";

// createDirectorySync(settingFilePath);
createDirectorySync(pageContentFolderPath);
createDirectorySync(jsonlFilePath);
createFileIfNotExist(jsonlFilePath);
// const settingDb = await JSONFilePreset(settingFilePath, []);

const resultUrlsTxt = fs.readFileSync(resultUrlsPath, "utf-8"); // for test, comment later !!!!!!!!!!!!!!!!
let bingResults = JSON.parse(resultUrlsTxt);

bingResults = [
  {
    link: "https://new.qq.com/rain/a/20241016A08CP400",
    title: "xxx",
  },
];

const getExplicitMatchedContent = ($) => {
  const contentSelectors = [
    `[data-role="paragraph"]`, // https://new.qq.com/rain/a/20241016A08CP400
    "article",
    ".article",
    ".detail-content",
    ".content-article",
    ".article-content",
    ".main",
    ".content",
    ".index_centent",
    `[data-testid="article"]`, //百家号 https://baijiahao.baidu.com/s?id=1730584141402361753
  ];

  let maxContent = null;
  let maxSelector = null;

  for (let i = 0; i < contentSelectors.length; i++) {
    const selector = contentSelectors[i];
    const contentText = $(selector).first().text().trim();
    if (contentText.length > 50) {
      maxContent = contentText;
      maxSelector = `$(${selector}).first().text().trim()`;
      break;
    }
  }
  return {
    content: maxContent,
    selector: maxSelector,
  };

  // return extractMaxContent($, contentSelectors, { limitedElementCount: 1 });
};

/**
 * 模糊匹配标签
 * @param {*} $
 * @returns
 */
const getImplicitMatchedContent = ($) => {
  // 定义可能包含正文的常见标签
  const contentSelectors = [
    ".article", // 常见的正文标签
    'div[class*="content"]',
    'div[class*="article"]',
    'div[id*="content"]',
    'div[id*="article"]',
    "main", // 网页主要内容的标签
    "section", // 可能包含正文的标签
    "p", // 段落
  ];

  return extractMaxContent($, contentSelectors, {
    extraDiscardFn: (currentContent) => {
      // const withTooManyBlank = hasConsecutiveBlanks(currentContent, 5, 5); // 判断是否太多空白字符，表示选择的范围太大了，包括了太多导航栏啥的
      const consecutiveBlanksCount = countConsecutiveBlanksGreaterThanN(
        currentContent,
        5
      ); // 判断是否太多空白字符，表示选择的范围太大了，包括了太多导航栏啥的

      console.log(`连续空白字符个数：${consecutiveBlanksCount},`);

      const withTooManyBlank = consecutiveBlanksCount > 10;
      return withTooManyBlank;
    },
  });
};

const getPageContentDataFromHtml = (htmlString) => {
  try {
    const dom = new JSDOM(htmlString);
    const $ = jquery(dom.window);
    const title =
      $("h1").text().replace(/\s+/g, "") || //
      $("h2").text().replace(/\s+/g, "") ||
      `${Date.now()}-${Math.round(Math.random() * 1000)}`; //

    // 先准确命中
    let pageContentText = "";
    let pageContentSelector = "";

    ({ content: pageContentText, selector: pageContentSelector } =
      getExplicitMatchedContent($));

    if (!pageContentText || pageContentText.length < 50) {
      // 没有准确命中个，再模糊名字
      ({ content: pageContentText, selector: pageContentSelector } =
        getImplicitMatchedContent($));
    }

    return {
      title,
      pageContentText,
      pageContentSelector,
    };
  } catch (error) {
    console.error(error);

    return {
      title: "",
      pageContentText: "",
    };
  }
};

const featchContent = async (pageContentUrl) => {
  // if (settingDb.data.includes(pageContentUrl)) {
  //   console.log(`当前页面已处理： ${pageContentUrl}`);

  //   return;
  // }

  console.log("featchContent url: ", pageContentUrl);

  let res_ = "";
  try {
    const response = await axios.get(pageContentUrl, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36`,
      },
    });
    // res_ = iconv.decode(response.data, "gbk");
    const tmpRes = iconv.decode(response.data, "utf-8");
    const dom = new JSDOM(tmpRes);

    const encoding = getHtmlEncoding(tmpRes) || "utf-8";

    res_ = iconv.decode(response.data, encoding);
  } catch (err) {
    console.error(err.message);
    // throw err;
    errorInfoStr += `\n${err.message}`;
  }
  const htmlString = String(res_);
  // console.log(`html length : ${htmlString}`);

  const { title, pageContentText, pageContentSelector } =
    getPageContentDataFromHtml(htmlString);


  // 打印收尾的一段内容， 来确认内容正确
  console.log(
    `pageContentText: ${pageContentText.slice(
      0,
      1000
    )} \n ----- \n ${pageContentText.slice(
      pageContentText.length - 500,
      pageContentText.length
    )}}`
  );


  // 不判断title，因为title有时候不标准，但不影响结果
  if (!pageContentText || pageContentText.length < 50) {
    // throw Error(`页面错误，请检查： ${pageContentUrl}`);
    errorInfoStr += `\n页面错误，请检查： ${pageContentUrl}`;
    return;
  }

  const fileName = title.slice(0, 60);
  const newTxtFilePath = path.join(pageContentFolderPath, `${fileName}.txt`);
  const finalPageContentText = `标题：${title}
  原文地址：${pageContentUrl}
  JQuery选择器：${pageContentSelector}
  
  正文：
  ${pageContentText}`;

  fs.writeFileSync(newTxtFilePath, finalPageContentText, "utf-8");

  // jsonl -------------------------------

  const chunkedContentList = splitStringIntoChunks(pageContentText, 3.8 * 1000); //  稳妥起见，做多3.9k
  for (let i = 0; i < chunkedContentList.length; i++) {
    const content = chunkedContentList[i];
    const newLine = JSON.stringify({
      title: title,
      pageContentUrl: pageContentUrl,
      releaseDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      content: content,
    });

    const origJsonlData = fs.readFileSync(jsonlFilePath, "utf8");
    const needNewLine = origJsonlData && !origJsonlData.endsWith("\n\n");
    fs.appendFileSync(jsonlFilePath, `${needNewLine ? "\n" : ""}${newLine}`);
    console.log(`写入jsonl 成功`);
  }

  // settingDb.data.push(pageContentUrl);
  // await settingDb.write();
};

setTimeout(async () => {
  for (let i = 0; i < bingResults.length; i++) {
    const { link, title } = bingResults[i];
    console.log(bingResults[i].link);

    if (
      [
        // 下面的地址有问题！
        "https://www.36kr.com", // 返回一坨js
        "https://www.cbre.com.cn",
        "https://zhuanlan.zhihu.com", // 反爬 https://zhuanlan.zhihu.com/p/577551904
        "https://baijiahao.baidu.com/", // 百度检测爬虫返回null
        "https://www.xpu.edu.cn/", // https://www.xpu.edu.cn/index/zbgs/144.htm
        "https://www.douyin.com/", // https://www.douyin.com/search/%E5%BB%9D%BF
        "https://wenku.baidu.com/", // https://wenku.baidu.com/view/d66d1.html
        "https://www.vzkoo.com/", // 内容正常，返回不过来， https://www.vzkoo.com/read/204a68fd1c9.html
        //
      ].some((url) => link.startsWith(url)) ||
      [
        ".pdf", //
        //
      ].some((url) => link.endsWith(url)) ||
      isDomainOnly(link)
    ) {
      continue;
    }

    await featchContent(link);
  }
  console.log("finished");
}, 0);

```
























# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
