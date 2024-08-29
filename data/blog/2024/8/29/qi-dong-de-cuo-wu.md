---
title: 'docker启动postgres的错误'
date: '2024-8-29'
tags: ["docker","postrgess"]
draft: false
summary:
---




docker启动postgres用下面的命令

```sh
docker run --name postgres-13 -v E:/docker-volumn/\postgres-2:/var/lib/postgresql/data -e POSTGRES_PASSWORD=123456 -p 5432:5432 postgres:13
```



但是遇到下面问题，主要内容是**has invalid permissions**

```shell
$ docker run --name postgres-13 -v E:/docker-volumn/\postgres:/var/lib/postgresql/data -e POSTGRES_PASSWORD=123456 -p 5432:5432 postgres:13
The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "en_US.utf8".
The default database encoding has accordingly been set to "UTF8".
The default text search configuration will be set to "english".

Data page checksums are disabled.

fixing permissions on existing directory /var/lib/postgresql/data ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default max_connections ... 20
selecting default shared_buffers ... 400kB
selecting default time zone ... Etc/UTC
creating configuration files ... ok
running bootstrap script ... 2024-08-29 10:15:51.178 UTC [83] FATAL:  data directory "/var/lib/postgresql/data" has invalid permissions
2024-08-29 10:15:51.178 UTC [83] DETAIL:  Permissions should be u=rwx (0700) or u=rwx,g=rx (0750).
child process exited with exit code 1
initdb: removing contents of data directory "/var/lib/postgresql/data"
```


一番搜索发现需要添加环境变量**GDATA=/var/lib/postgresql/data/pgdata**， 最终命令如下

```shell
docker run --name postgres-13 -v E:/docker-volumn/\postgres-2:/var/lib/postgresql/data -e PGDATA=/var/lib/postgresql/data/pgdata -e POSTGRES_PASSWORD=123456 -p 5432:5432 postgres:13
```



# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生
