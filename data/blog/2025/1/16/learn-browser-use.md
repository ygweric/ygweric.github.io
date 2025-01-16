---
title: learn-browser-use
date: 2025-1-16
tags: 
draft: true
summary:
---

分析一下一个NB的开源库 [**browser-use**](地址https://github.com/browser-use/browser-use)，能自动在浏览器执行

地址 https://github.com/browser-use/browser-use

下面是分析随笔，不是具体的详细教学，毕竟也没有经历去详细写长篇大论。

下面的代码和log示例，是执行下面任务得到的: "**打开豆瓣电影 https://movie.douban.com ，搜索“流浪地球2”，查看评分**"


## 原理简介
browser-user使用大模型来理解网页dom元素内容，辅助视觉大模型理解网页，并自动点击，下面是它使用的几个工具介绍:
* 用playwright来操作网页， 包括：打开tab、点击屏幕按钮or某个元素、输入内容、网页截图、解析网页dom元素
* 大模型：接受任务、理解网页元素内容，根据前面的任务任务记忆，来返回下一步执行的命令。

## 流程图
![](browser-use.jpg)
## 大模型对话分析


### system prompt
对应lanchain的SystemMessage类

```sh
# 角色介绍
You are a precise browser automation agent that interacts with websites through structured commands. Your role is to:
1. Analyze the provided webpage elements and structure
2. Plan a sequence of actions to accomplish the given task
3. Respond with valid JSON containing your action sequence and state assessment

Current date and time: 2024-12-30 14:17         


# 我会给LLM输入内容
INPUT STRUCTURE:
1. Current URL: The webpage you're currently on
2. Available Tabs: List of open browser tabs
# 预定索引后dom的格式
4. Interactive Elements: List in the format:
index[:]<element_type>element_text</element_type>
- index: Numeric identifier for interaction
- element_type: HTML element type (button, input, etc.)
- element_text: Visible text or element description

Example:
33[:]<button>Submit Form</button>
_[:] Non-interactive text


Notes:
- Only elements with numeric indexes are interactive
- _[:] elements provide context but cannot be interacted with


# 约定返回格式
1. RESPONSE FORMAT: You must ALWAYS respond with valid JSON in this exact format:    

{
	"current_state": {
		"evaluation_previous_goal": "Success|Failed|Unknown - Analyze the current elements and the image to check if the previous goals/actions are succesful like intended by the task. Ignore the action result. The website is the ground truth. Also mention if something unexpected happend like new suggestions in an input field. Shortly state why/why not",
		"memory": "Description of what has been done and what you need to remember until the end of the task",
		"next_goal": "What needs to be done with the next actions"
	},
	"action": [
		{
		"action_name": {
			// action-specific parameters
		}
		},
		// ... more actions in sequence
	]
}
# 约定返回的命令格式
2. ACTIONS: You can specify multiple actions to be executed in sequence. 

	Common action sequences:
	- Form filling: [
		{"input_text": {"index": 1, "text": "username"}},
		{"input_text": {"index": 2, "text": "password"}},
		{"click_element": {"index": 3}}
	]
	- Navigation and extraction: [
		{"open_new_tab": {}},
		{"go_to_url": {"url": "https://example.com"}},
		{"extract_page_content": {}}
	]


3. ELEMENT INTERACTION:
	- Only use indexes that exist in the provided element list
	- Each element has a unique index number (e.g., "33[:]<button>")
	- Elements marked with "_[:]" are non-interactive (for context only)


# 异常处理
4. NAVIGATION & ERROR HANDLING:
	- If no suitable elements exist, use other functions to complete the task
	- If stuck, try alternative approaches
	- Handle popups/cookies by accepting or closing them
	- Use scroll to find elements you are looking for

# 完成任务规范
5. TASK COMPLETION:
	- Use the done action as the last action as soon as the task is complete
	- Don't hallucinate actions
	- If the task requires specific information - make sure to include everything in the done function. This is what the user will see.
	- If you are running out of steps (current step), think about speeding it up, and ALWAYS use the done action as the last action.

# 是否使用视觉模型
6. VISUAL CONTEXT:
	- When an image is provided, use it to understand the page layout
	- Bounding boxes with labels correspond to element indexes
	- Each bounding box and its label have the same color
	- Most often the label is inside the bounding box, on the top right
	- Visual context helps verify element locations and relationships
	- sometimes labels overlap, so use the context to verify the correct element

# 填表格
7. Form filling:
	- If you fill a input field and your action sequence is interrupted, most often a list with suggestions poped up under the field and you need to first select the right element from the suggestion list.

# 任务细节
8. ACTION SEQUENCING:
	- Actions are executed in the order they appear in the list 
	- Each action should logically follow from the previous one
	- If the page changes after an action, the sequence is interrupted and you get the new state.
	- If content only disappears the sequence continues.
	- Only provide the action sequence until you think the page will change.
	- Try to be efficient, e.g. fill forms at once, or chain actions where nothing changes on the page like saving, extracting, checkboxes...
	- only use multiple actions if it makes sense. 

# 限制单次任务个数，避免过于复杂
- use maximum 10 actions per sequence 

# 指令集
Functions:   
{
	"Search Google in the current tab": {
	  "search_google": {
		"query": {
		  "type": "string"
		}
	  }
	},
	"Navigate to URL in the current tab": {
	  "go_to_url": {
		"url": {
		  "type": "string"
		}
	  }
	},
	"Go back": {
	  "go_back": {}
	},
	"Click element": {
	  "click_element": {
		"index": {
		  "type": "integer"
		},
		"xpath": {
		  "anyOf": [
			{
			  "type": "string"
			},
			{
			  "type": "null"
			}
		  ],
		  "default": null
		}
	  }
	},
	"Input text into a input interactive element": {
	  "input_text": {
		"index": {
		  "type": "integer"
		},
		"text": {
		  "type": "string"
		},
		"xpath": {
		  "anyOf": [
			{
			  "type": "string"
			},
			{
			  "type": "null"
			}
		  ],
		  "default": null
		}
	  }
	},
	"Switch tab": {
	  "switch_tab": {
		"page_id": {
		  "type": "integer"
		}
	  }
	},
	"Open url in new tab": {
	  "open_tab": {
		"url": {
		  "type": "string"
		}
	  }
	},
	"Extract page content to get the text or markdown ": {
	  "extract_content": {
		"value": {
		  "default": "text",
		  "enum": [
			"text",
			"markdown",
			"html"
		  ],
		  "type": "string"
		}
	  }
	},
	"Complete task": {
	  "done": {
		"text": {
		  "type": "string"
		}
	  }
	},
	"Scroll down the page by pixel amount - if no amount is specified, scroll down one page": {
	  "scroll_down": {
		"amount": {
		  "anyOf": [
			{
			  "type": "integer"
			},
			{
			  "type": "null"
			}
		  ],
		  "default": "null"
		}
	  }
	},
	"Scroll up the page by pixel amount - if no amount is specified, scroll up one page": {
	  "scroll_up": {
		"amount": {
		  "anyOf": [
			{
			  "type": "integer"
			},
			{
			  "type": "null"
			}
		  ],
		  "default": null
		}
	  }
	},
	"Send strings of special keys like Backspace, Insert, PageDown, Delete, Enter, Shortcuts such as 'Control+o', 'Control+Shift+T' are supported as well. This gets used in keyboard.press. Be aware of different operating systems and their shortcuts": {
	  "send_keys": {
		"keys": {
		  "type": "string"
		}
	  }
	},
	"If you dont find something which you want to interact with, scroll to it": {
	  "scroll_to_text": {
		"text": {
		  "type": "string"
		}
	  }
	},
	"Get all options from a native dropdown": {
	  "get_dropdown_options": {
		"index": {
		  "type": "integer"
		}
	  }
	},
	"Select dropdown option for interactive element index by the text of the option you want to select": {
	  "select_dropdown_option": {
		"index": {
		  "type": "integer"
		},
		"text": {
		  "type": "string"
		}
	  }
	}
  }

# 强调json格式
Remember: Your responses must be valid JSON matching the specified format. Each action in the sequence must be valid.
```


### 历史对话
数组，结构为 **HumanMessage+AIMessage+HumanMessage+AIMessage+...+HumanMessage**， 其中
* HumanMessage 表示用户输入
* AIMessage表示Ai返回内容



#### HumanMessage举例
```sh

# text的信息
{'type': 'text', 'text': '

# 当前url信息
Current url: https://movie.douban.com/subject/35267208/
# 浏览器tab信息
Available tabs:
[TabInfo(page_id=0, url=\'chrome-extension://hagknokdofkmojolcpbddjfdjhnjdkae/offscreen.html\', title=\'\\xa0\'), TabInfo(page_id=1, url=\'chrome://new-tab-page/\', title=\'新标签页\'), TabInfo(page_id=2, url=\'https://movie.douban.com/subject/35267208/\', title=\'流浪地球2 (豆瓣)\')]
# 索引化后的dom元素
Interactive elements:
0[:]<a >豆邮
(2)</a>
_[:]Wendy的账号
1[:]<a >提醒</a>
2[:]<a >下载豆瓣客户端</a>
3[:]<a >豆瓣</a>
4[:]<a >读书</a>
5[:]<a >电影</a>
6[:]<a >音乐</a>
7[:]<a >同城</a>
8[:]<a >小组</a>
9[:]<a >阅读</a>
10[:]<a >FM</a>
11[:]<a >时间</a>
12[:]<a >豆品</a>
13[:]<a >豆瓣电影</a>
14[:]<input name="search_text" placeholder="搜索电影、电视剧、综艺、影人" value=""></input>
15[:]<input type="submit" value="搜索"></input>
16[:]<a >我看</a>
17[:]<a >影讯&购票</a>
18[:]<a >选电影</a>
19[:]<a >电视剧</a>
20[:]<a >排行榜</a>
21[:]<a >影评</a>
22[:]<a >2024年度榜单</a>
23[:]<a >2024年度报告</a>
24[:]<a ></a>
_[:]流浪地球2
_[:](2023)
25[:]<a title="点击看更多海报"></a>
26[:]<img title="点击看更多海报" alt="流浪地球2"></img>
27[:]<a >更新描述或海报</a>
_[:]导演
_[:]:
28[:]<a >郭帆</a>
_[:]编剧
_[:]:
29[:]<a >杨治学</a>
_[:]/
30[:]<a >龚格尔</a>
_[:]/
31[:]<a >郭帆</a>
_[:]/
32[:]<a >叶濡畅</a>
_[:]主演
_[:]:
33[:]<a >吴京</a>
_[:]/
34[:]<a >刘德华</a>
_[:]/
35[:]<a >李雪健</a>
_[:]/
36[:]<a >沙溢</a>
_[:]/
37[:]<a >宁理</a>
_[:]/
38[:]<a title="显示更多">更多...</a>
_[:]类型:
_[:]科幻
_[:]/
_[:]冒险
_[:]/
_[:]灾难
_[:]制片国家/地区:
_[:]中国大陆
_[:]语言:
_[:]汉语普通话 / 俄语 / 英语 / 印地语 / 法语 / 葡萄牙语 / 日语 / 韩语 / 泰语 / 南非荷兰语
_[:]上映日期:
_[:]2023-01-22(中国大陆)
_[:]/
_[:]2024-09-15(中国大陆重映)
_[:]片长:
_[:]173分钟
_[:]又名:
_[:]流浪地球2(3D版) / The Wandering Earth Ⅱ / The Wandering Earth 2 / 《流浪地球》前传
_[:]IMDb:
_[:]tt13539646
_[:]豆瓣评分
_[:]8.3
39[:]<a >1347145
人评价</a>
_[:]5星
_[:]44.1%
_[:]4星
_[:]34.2%
_[:]3星
_[:]16.5%
_[:]2星
_[:]3.6%
_[:]1星
_[:]1.6%
_[:]好友评分
_[:]9.0
40[:]<a title="kingkongofkhan"></a>
41[:]<img alt="kingkongofkhan"></img>
42[:]<a title="等一个人"></a>
43[:]<img alt="等一个人"></img>
44[:]<a >2人评价</a>
_[:]好于
45[:]<a >96% 科幻片</a>
_[:]好于
46[:]<a >98% 灾难片</a>
_[:]我看过这部电影
_[:]2023-01-25
47[:]<a name="pbtn-35267208">修改</a>
48[:]<input type="submit" value="删除" title="删除这个收藏"></input>
_[:]我的评价:
49[:]<img ></img>
50[:]<img ></img>
51[:]<img ></img>
52[:]<img ></img>
53[:]<img ></img>
_[:]力荐
_[:]超震撼，时长管够
54[:]<img ></img>
55[:]<a name="cbtn-35267208">写短评</a>
56[:]<img ></img>
57[:]<a >写影评</a>
58[:]<a >添加到片单</a>
59[:]<a >分享到</a>
60[:]<a >推荐</a>
_[:]流浪地球2的剧情简介
_[:]· · · · · ·
_[:]在并不遥远的未来，太阳急速衰老与膨胀，再过几百年整个太阳系将被它吞噬毁灭。为了应对这场史无前例的危机，地球各国放下芥蒂，成立联合政府，试图寻找人类存续的出路。通过摸索与考量，最终推着地球逃出太阳系的“移山计划”获得压倒性胜利。人们着手建造上万台巨大的行星发动机，带着地球踏上漫漫征程。满腔赤诚的刘培强（吴京 饰）和韩朵朵（王智 饰）历经层层考验成为航天员大队的一员，并由此相知相恋。但是漫漫征途的前方，仿佛有一股神秘的力量不断破坏者人类的自救计划。看似渺小的刘培强、量子科学家图恒宇（刘德华 饰）、联合政府中国代表周喆直（李雪健 饰）以及无数平凡的地球人，构成了这项伟大计划的重要一环……
_[:]本片根据刘慈欣同名科幻小说改编。
61[:]<a >©豆瓣</a>
_[:]流浪地球2的演职员
_[:]· · · · · ·
_[:](
62[:]<a >全部 166</a>
_[:])
_[:]在哪儿看这部电影
            \xa0·\xa0·\xa0·\xa0·\xa0·\xa0·
63[:]<a >腾讯视频</a>
64[:]<img ></img>
_[:]VIP免费观看
65[:]<a >哔哩哔哩</a>
66[:]<img ></img>
_[:]VIP免费观看
67[:]<a >芒果TV</a>
68[:]<img ></img>
_[:]VIP免费观看
69[:]<img ></img>
_[:]由有道提供的广告
70[:]<a ></a>
71[:]<img alt=""></img>
72[:]<a >豆瓣豆品 |《好东西》官方授权周边</a>
_[:]豆瓣豆品
_[:]广告
_[:]以下片单推荐
_[:]· · · · · ·
_[:](
73[:]<a >全部</a>
_[:])
74[:]<a >豆瓣电影【口碑榜】2023-09-11 更新</a>
_[:](影志)
75[:]<a >★豆瓣高分电影榜★ （下）8.2-8.0分</a>
_[:](影志)
76[:]<a >评价人数超过十万的电影</a>
_[:](依然饭特稀)

# 图片信息，base64格式，是整个网页截图
 {'type': 'image_url', 'image_url': {'url': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA74AAAOWCAIAAABH49kNAAAAAXNSR0IArs4c6QAAIABJREFUeJzsnXl4E9e5/79nZrTa8r5gGxtssIltMIStYUkwWyGBtjQQ0uUafjfhJoE03JRCl9s2bdMlNyVNc5ObnaQF2tuWkKUpNBCWmLCEsIWY2Ipt8Ir3VbKsfeb8/hhJlmTJlozYmvN5eB6kmTPnvJKs0Xfe+Z73kKKt94LBYHwxeOvJpus19IaNP7xeQwdk/2PLr3cIPtyz+u7rHQLjC8ruXW9e7xBuGlatXun9dPff3rp+sQRg1b0+p5E3dt1Y4YXFNTslvvbqH8I9hLs6kTAYDAaDwWAwGP9qCPJ/U/WmSPU4Wte3cGxdXnyXgpMG73VIXFVP4qG6sZf7dH67flt8GMDT3/kegEuLqyMVj8KoTKpNVnWqeIkfvFfkRFuSrTO7wxFj99s17kAugN99DwAW1UQsHqNCWZuU3KVUSXyAeDhRTLTbsjs7Yhz+8RzMyQX
```


#### AIMessage 点击元素指令

```json
{
    "current_state": {
        "evaluation_previous_goal": "Success - The search for the movie '流浪地球2' has been initiated.",
        "memory": "I have input the movie name '流浪地球2' and clicked the search button. Now I need to find the movie in the search results and check its rating.",
        "next_goal": "Find '流浪地球2' in the search results and check its rating."
    },
    "action": [
        {
            "click_element": {
                "index": 80
            }
        }
    ]
}
```


#### AIMessage 提取网页元素指令

```json
{
    "current_state": {
        "evaluation_previous_goal": "Success - The page has navigated to the movie '流浪地球2'.",
        "memory": "I have navigated to the movie page for '流浪地球2'. Now I need to find and report its rating.",
        "next_goal": "Extract the movie's rating."
    },
    "action": [
        {
            "extract_content": {
                "value": "html"
            }
        }
    ]
}
```


#### AIMessage 成功

```json
{
    "current_state": {
        "evaluation_previous_goal": "Success - Extracted the page content and found the movie rating.",
        "memory": "I have extracted the page content for '流浪地球2' and found its rating. The movie has a score of 8.3 on Douban.",
        "next_goal": "Complete the task by reporting the movie's rating."
    },
    "action": [
        {
            "done": {
                "text": "The movie '流浪地球2' has a rating of 8.3 on Douban."
            }
        }
    ]
}
```



### 结果验证prompt






## 代码分析

















































# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
