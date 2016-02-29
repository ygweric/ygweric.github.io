---
layout: post
published: true
title:  "Android QA"
date:   2016-2-22 00:00:00 +0700
categories: IT
tags:
- Android
- IT
---


----

View method information:  CTRL+J 
Find Class: (Mac) CMD+O, (Windows) CTRL+N
Find File: (Mac) CMD+SHFT+O, (Windows) CTRL+SHFT+N
Refactor/Rename: SHFT+F6
Quick Fix (including string resource refactor): ALT+ENTER
Go to Class Definition: (Mac) CMD+B, (Windows) CTRL+B
Run: (Mac) CTRL+R, (Windows) SHFT+F10
Debug: (Mac) CTRL+D, (Windows) SHFT+F9


Command look-up (autocomplete command name)	CTRL + SHIFT + A
Project quick fix	ALT + ENTER
Reformat code	CTRL + ALT + L (Win)
OPTION + CMD + L (Mac)
Show docs for selected API	CTRL + Q (Win)
F1 (Mac)
Show parameters for selected method	CTRL + P
Generate method	ALT + Insert (Win)
CMD + N (Mac)
Jump to source	F4 (Win)
CMD + down-arrow (Mac)
Delete line	CTRL + Y (Win)
CMD + Backspace (Mac)
Search by symbol name	CTRL + ALT + SHIFT + N (Win)
OPTION + CMD + O (Mac)

Build	CTRL + F9 (Win)
CMD + F9 (Mac)
Build and run	SHIFT + F10 (Win)
CTRL + R (Mac)
Toggle project visibility	ALT + 1 (Win)
CMD + 1 (Mac)
Navigate open tabs	ALT + left-arrow; ALT + right-arrow (Win)
CTRL + left-arrow; CTRL + right-arrow (Mac)
----


30.谈谈android数据存储方式。
Android提供了5种方式存储数据：
（1）使用SharedPreferences存储数据；它是Android提供的用来存储一些简单配置信息的一种机制，采用了XML格式将数据存储到设备中。只能在同一个包内使用，不能在不同的包之间使用。
（2）文件存储数据；文件存储方式是一种较常用的方法，在Android中读取/写入文件的方法，与Java中实现I/O的程序是完全一样的，提供了openFileInput()和openFileOutput()方法来读取设备上的文件。
（3）SQLite数据库存储数据；SQLite是Android所带的一个标准的数据库，它支持SQL语句，它是一个轻量级的嵌入式数据库。
（4）使用ContentProvider存储数据；主要用于应用程序之间进行数据交换，从而能够让其他的应用保存或读取此Content Provider的各种数据类型。
（5）网络存储数据；通过网络上提供给我们的存储空间来上传(存储)和下载(获取)我们存储在网络空间中的数据信息

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----

----
