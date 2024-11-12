---
title: 掘金分析（一）- 推荐文章高频词分析
date: 2024-11-12
tags:
  - 爬虫
  - python，js
draft: false
summary:
---

最近做大模型、爬虫比较上头，但发掘金的文章一直不温不火，同时也感觉掘金的硬核文章页越来越少，噱头越来越多。索性就分析下我的文章推荐流中到底有什么特点。

# 获取首页推荐流数据
首先手动截取了我的首页推荐文章的地址和标题，保存为json如下,下面只显示了部分内容，总共有1358条数据，是首页数据流下拉100次左右的结果。

```json
[
    {
        "pageContentUrl": "https://juejin.cn//post/7419148660796293139",
        "pageContentTitle": "实现敏感字段脱敏注解@Sensitive"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7370682998990553100",
        "pageContentTitle": "终于拿到了 WXG 的 offer，却只能无奈放弃 🥺"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7320102376174862346",
        "pageContentTitle": "我的2023，被裁员"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7398091377663836200",
        "pageContentTitle": "汗流浃背的45分钟--上海某公司一面"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7367275063873470502",
        "pageContentTitle": "房车用了两年多，这个油耗我是没有想到的"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7400253623790272547",
        "pageContentTitle": "面试必问，防抖函数的核心是什么？"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7366567675315126281",
        "pageContentTitle": "从20k到50k再到2k，聊聊我在互联网干前端的这几年"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7419954652684632083",
        "pageContentTitle": "typeof 的三大奇观"
    },
    {
        "pageContentUrl": "https://juejin.cn//post/7299849645206781963",
        "pageContentTitle": "【Vue3】如何封装一个超级好用的 Hook ！"
    },
    ...其余1300+条数据
]
```


下面要考虑是否分析文章的内容的问题，还是只分析标题。

标题是最重要的，索性从标题开始吧，将上面json内容的标题转换为txt文件，供后面分析。

标题的纯txt文件也有3万字，72kb了。妥妥一个中篇小说。

![](Pasted%20image%2020241112114243.png)

# 词频分析

然后上python代码，进行词频分析。

这里说明下，我的第一语言是js，全栈，不过python的代码库比较多，对大模型支持也很好。所以最近也逐渐让自己去写一下python。

词频分析的python代码如下，python的版本是**Python 3.12.3**, 下面介绍下里面的几个知识点，python大佬勿喷，我只是一个python初学者，一路跟着大模型学习。

## 词频分析-知识点
1. 使用**jieba** 作为分词器，对中文支持良好
2. 使用**collections**的**Counter**作为计数器，当然自己创建map计数也行。
3. 使用**pandas**导出最后结果到excel中，方便可视化统计
4. 头一次听说**停止词**，也就是文章中的无意义词，有哈工大停用词表、百度停用词，我在 https://github.com/goto456/stopwords 这个地方下载的。
5. 我截取了前100名的高频词，后面的长尾词不分析了，没意义

**部分停止词**

```
他人
它
它们
她
她们
倘
倘或
倘然
倘若
倘使
```


## python词频分析代码
```python
import jieba
import re
from collections import Counter
import pandas as pd


base_path = 'res/word-count/'
stopword_path = base_path + 'stopwords/'

def load_stopwords(file_path):
    stopwords = set()
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            # 去除每行的换行符并添加到集合中
            word = line.strip()
            if word:  # 确保不是空行
                stopwords.add(word)
    return stopwords


stop_words = load_stopwords(stopword_path+'baidu_stopwords.txt') | load_stopwords(stopword_path+'cn_stopwords.txt') | load_stopwords(stopword_path+'hit_stopwords.txt') | load_stopwords(stopword_path+'scu_stopwords.txt')

with open(base_path+'juejin-1.txt', 'r', encoding='utf-8') as f:
    text = f.read()
    
# 去除标点符号
text = re.sub(r'[^\w\s]', '', text)

words = jieba.lcut(text)
filtered_words = [word for word in words if word not in stop_words  and len(word) > 1]
word_frequency = Counter(filtered_words)

for word, frequency in word_frequency.most_common(100):
    print(f'{word}: {frequency}')
    
    
# 创建 DataFrame
df = pd.DataFrame(word_frequency.most_common(100), columns=['单词', '词频'])


output_file =base_path+ 'word_frequency.xlsx'
df.to_excel(output_file, index=False)
```


# 生成词云
这里使用的是 https://design.weiciyun.com/ 生成的词云，免费，但有水印，可以选择形状，做的不错。

词云的最终结果如下，能很明显的看出掘金最近推荐的都是些啥。
![](微词云.jpg)



# 意味着什么？


上面的词云，猛一看大为感慨，但仔细看有分不出来个所以然。哎，索性让通义千问来分析了，下面是我的提示词

```
我是一个前端开发工程师，我统计了技术网站给我推荐的文章列表的词频如下，请告诉我有什么值得发现的地方


前端: 154
开发: 75
AI: 59
代码: 58
项目: 41
面试: 38
技术: 36
JavaScript: 31
组件: 31
实践: 30
原理: 30
数据: 30
...
```

btw: 豆包也回答了，但我觉得通义千问回答的好。

## 通义回答如下：
	从您提供的词频统计数据中，可以得出几个值得关注的趋势和特点：
	
	1. **前端技术依然是核心**：
	   - “前端”一词出现次数最高（154次），这表明前端开发是这些文章的核心主题。同时，“JavaScript”、“CSS”、“Vue”等前端相关技术词汇也频繁出现，说明这些技术仍然是前端开发的重点。
	
	2. **开发工具和技术栈的多样化**：
	   - “Vue3”（27次）、“React”（13次）、“Spring”（20次）等框架或库的名字多次出现，显示出开发者对不同技术栈的兴趣。这可能意味着在选择合适的工具和技术来构建项目时，存在多样化的趋势。
	
	3. **AI与前端的融合**：
	   - “AI”一词出现了59次，结合“前端”、“开发”等关键词，可以看出人工智能技术正逐渐融入前端开发领域，可能是通过智能推荐、自动化测试、辅助编码等方式。
	
	4. **性能优化和用户体验的关注**：
	   - “优化”（26次）、“性能”（21次）、“加载”（12次）、“体验”（12次）等词汇的出现，表明开发者越来越重视应用的性能和用户体验。
	
	5. **面试准备的重要性**：
	   - “面试”（38次）、“面试官”（23次）、“面试题”（17次）、“刷题”（17次）等词汇的出现频率较高，说明求职者和在职开发者都在积极准备面试，以提高自己的竞争力。
	
	6. **新技术和新标准的关注**：
	   - “鸿蒙”（21次）作为一个新的操作系统被提及，可能反映了市场对于新兴技术和平台的兴趣。
	   - “2024”（22次）和“2023”（11次）这两个年份的出现，可能意味着开发者关注最新的技术和行业趋势。
	
	7. **开源文化的普及**：
	   - “开源”一词出现了25次，表明开源软件和项目的贡献及使用在开发者社区中占据重要位置。
	
	综上所述，您的阅读偏好或技术网站的文章推荐主要集中在前端技术的发展、工具的选择与使用、AI技术的应用、性能优化、面试准备以及对新技术的关注等方面。这不仅体现了前端领域的最新动向，也为开发者提供了丰富的学习资源和发展方向。


# 我来总结下

1. AI已经融入到开发中的方方面面
2. 面试、刷题依然是程序员沟通的主要话题
3. 开源逐渐普遍。






















# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
