---
title: docker启动WSL错误解决-改用hyper-v引擎
date: 2024-8-29
tags:
  - docker
draft: false
summary:
---


# 结论
未解决，直接放弃wsl，使用 了hyper-v,
虽然hyper-v慢一点，但本来就是自己电脑开发测试用的，慢就慢吧，等真不能用了再说。重新装一下到时候。


# 改用hyper-v引擎
启动hyper-v,过程如下
### [Enable Hyper-V Manager on Windows](https://www.dell.com/support/manuals/zh-cn/dell-imageassist/dia_dynamic_ug/enable-hyper-v-manager-on-windows?guid=guid-80b4ffe0-6247-4a75-8b66-222bfd2cc50a&lang=en-us#:~:text=Go%20to%20Control%20Panel%20%3E%20Program,Hyper%2DV%20and%20click%20OK.)

```
Related video: [Activating Hyper-V Manager](https://youtu.be/aVMD8FfHJhw)

#### Steps

1. Go to Control Panel > Program > Program and Features.
2. Click Turn Windows features on or off.

    The Windows Features window is displayed.

3. Select Hyper-V and click OK.

    The system restarts to enable Hyper-V Manager.

4. Open Hyper-V Manager.
```



结果docker中所有的images和container都没了~
![](Pasted%20image%2020240829121614.png)



**下面内容是尝试解决过程，但都不成功！！！**
**下面内容是尝试解决过程，但都不成功！！！**
**下面内容是尝试解决过程，但都不成功！！！**


# 错误内容

```
An unexpected error occurred while executing a WSL command.

Either shut down WSL down with `wsl --shutdown`, and/or reboot your machine. You can also try reinstalling WSL and/or Docker Desktop. If the issue persists, [collect diagnostics and submit an issue⁠](https://docs.docker.com/desktop/troubleshoot/overview/?utm_source=docker_desktop_error_dialog#diagnose-from-the-terminal).

provisioning docker WSL distros: ensuring main distro is deployed: deploying "docker-desktop": importing WSL distro "此应用程序需要适用于 Linux 的 Windows 子系统可选组件。\r\n通过运行安装它： wsl.exe --install --no-distribution\r\n可能需要重新启动系统才能使更改生效。\r\nError code: Wsl/WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED\r\n" output="docker-desktop": exit code: 4294967295: running WSL command wsl.exe C:\Windows\System32\wsl.exe --import docker-desktop <HOME>\AppData\Local\Docker\wsl\distro C:\Program Files\Docker\Docker\resources\wsl\wsl-bootstrap.tar --version 2: 此应用程序需要适用于 Linux 的 Windows 子系统可选组件。
通过运行安装它： wsl.exe --install --no-distribution
可能需要重新启动系统才能使更改生效。
Error code: Wsl/WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED
: exit status 0xffffffff

[Read our policy for uploaded diagnostic data⁠](https://docs.docker.com/support/?utm_source=docker_desktop_error_dialog#how-is-personal-diagnostic-data-handled-in-docker-desktop "https://docs.docker.com/support/#how-is-personal-diagnostic-data-handled-in-docker-desktop")
```
![](Pasted%20image%2020240829114216.png)


起因是安卓模拟器，有问题，点击了一键修复，**关闭hyper-v**
![](Pasted%20image%2020240829115658.png)


结果就启动不了了，下面是尝试的解决方案


# 解决方法











# 下面方法不工作


## ~~方法1~~

open PowerShell in administrator mode Run command: 'wsl --update'


## ~~方法2
运行下面命令

```
wsl --update --web-download
```

![](Pasted%20image%2020240829102905.png)




# ~~方法3~~


```
wsl --install
```


![](Pasted%20image%2020240829115816.png)





```
I got this error on 4.32.0 upgrade and tried some things online with no success. What did work for me:
Try the following:

1. Stop Docker Desktop
2. Run the following command in your terminal wsl --unregister docker-desktop
3. Run Docker Desktop again (Will recreate the distro)

May need to run terminal/Powershell as Administrator. I had to, as I run Docker Desktop as an Administrator. But these steps worked for me
```

![](Pasted%20image%2020240829115945.png)






# 关于我
国 wei (Eric)
[Github](https://github.com/ygweric)

# [扫码加入独立开发微信群-二维码经常更新](https://raw.githubusercontent.com/ygweric/ygweric.github.io/main/assets/qr-schedule-update/indenpendent_dev.png)

# 关注公众号 [开发副业](https://github.com/ygweric/ygweric.github.io/blob/main/assets/jinjing/wx_office_account_qr.png?raw=true)，闲谈代码人生



