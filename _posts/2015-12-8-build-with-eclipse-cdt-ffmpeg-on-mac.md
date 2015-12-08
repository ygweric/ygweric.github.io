---
layout: post
---


----

This FFmpeg version is 2.8

----


####the latest version `make` error , the stable release has no error

````
eprecated here
void av_picture_copy(AVPicture *dst, const AVPicture *src,
     ^
ffplay.c:3761:24: error: token is not a valid binary operator in a preprocessor subexpression
if CONFIG_AVDEVICE    avdevice_register_all();

````

----

[/bin/sh: ___: command not found](http://stackoverflow.com/a/20102200/1142674)

If so I found the problem is that OSX does not pass the PATH variable to applications started through the GUI. So to get around this one should start eclipse **from the terminal**. This worked when I had the problem.

````
HTML	doc/ffmpeg.html
/bin/sh: texi2html: command not found
make: *** [doc/ffmpeg.html] Error 127


CC	libavfilter/vsrc_testsrc.o
/bin/sh: yasm: command not found
make: *** [libavfilter/x86/af_volume.o] Error 127
````

---


[Installing GDB on OS X Mavericks](http://ntraft.com/installing-gdb-on-os-x-mavericks/)

````
Launching "ffplay_g" has encountered a problem
Error with command: gdb --version
Cannot run program "gdb": Unknown reason
````





[Homebrew formula of GDB with patch for OS X Yosemite](https://gist.github.com/ymyzk/10ad2b74af9235eddb2c)

`brew install https://gist.githubusercontent.com/ymyzk/10ad2b74af9235eddb2c/raw/9d0b9734ea01f9753a5f54dd221acd99ee7e53e8/gdb.rb`



[Eclipse GDB debugger support](http://stackoverflow.com/a/28974957/1142674)


----
[Can't find the tool settings in Eclipse CDT](http://stackoverflow.com/a/18713110/1142674)

I switched C/C++ Build->Builder Settings->Builder type to External Builder, if builder type is disable, do `restore defaults`, and closed the properties window. When reopening properties the C/C++ Build->Settings->Tool Settings Tab was available.

----
####Error: `unresolved inclusion: <SDL.h>`

Fix: Properties -> C/C++ General -> Paths and Symbols ->includes -> GUN C++ (and  GUN C) -> add `/usr/local/include/SDL`

**ffmpeg not support SDL2 now**


-----





