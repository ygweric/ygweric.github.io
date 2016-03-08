---
layout: post
---


----

This FFmpeg version is 2.8

----





#### the latest version `make` error , the stable release has no error

```
eprecated here
void av_picture_copy(AVPicture *dst, const AVPicture *src,
     ^
ffplay.c:3761:24: error: token is not a valid binary operator in a preprocessor subexpression
if CONFIG_AVDEVICE    avdevice_register_all();

```

----

[/bin/sh: ___: command not found](http://stackoverflow.com/a/20102200/1142674)

If so I found the problem is that OSX does not pass the PATH variable to applications started through the GUI. So to get around this one should start eclipse **from the terminal**. This worked when I had the problem.

```
HTML	doc/ffmpeg.html
/bin/sh: texi2html: command not found
make: *** [doc/ffmpeg.html] Error 127


CC	libavfilter/vsrc_testsrc.o
/bin/sh: yasm: command not found
make: *** [libavfilter/x86/af_volume.o] Error 127
```

---


[Installing GDB on OS X Mavericks](http://ntraft.com/installing-gdb-on-os-x-mavericks/)

```
Launching "ffplay_g" has encountered a problem
Error with command: gdb --version
Cannot run program "gdb": Unknown reason
```





[Homebrew formula of GDB with patch for OS X Yosemite](https://gist.github.com/ymyzk/10ad2b74af9235eddb2c)

`brew install https://gist.githubusercontent.com/ymyzk/10ad2b74af9235eddb2c/raw/9d0b9734ea01f9753a5f54dd221acd99ee7e53e8/gdb.rb`



[Eclipse GDB debugger support](http://stackoverflow.com/a/28974957/1142674)


----
[Can't find the tool settings in Eclipse CDT](http://stackoverflow.com/a/18713110/1142674)

I switched C/C++ Build->Builder Settings->Builder type to External Builder, if builder type is disable, do `restore defaults`, and closed the properties window. When reopening properties the C/C++ Build->Settings->Tool Settings Tab was available.

----
#### Error: `unresolved inclusion: <SDL.h>`

Fix: Properties -> C/C++ General -> Paths and Symbols ->includes -> GUN C++ (and  GUN C) -> add `/usr/local/include/SDL`

**ffmpeg not support SDL2 now**


-----
**I am not sure this section is correct, because I not click "run to next" in eclipse. After I do the following step, there are still "No Source Available", But once I click "next", everything is well 😢**


[No Source Available](http://stackoverflow.com/a/2340194/1142674) 
The problem was that I was using the Release version of SDL instead of the Debug version! (I had 'libsdl' from MacPorts whereas I should have had 'libsdl-devel'.)


[Building SDL in debug mode on Linux](https://forums.libsdl.org/viewtopic.php?t=8931&sid=2084746b8b336f1743d305a5aa83938c) 

`./configure --enable-debug` or `CFLAGS='-O0 -g' ./configure `




----

### 

Error:`./include/SDL_syswm.h:58:10: fatal error: 'X11/Xlib.h' file not found`

Fix:`export CPPFLAGS=-I/opt/X11/include`

-
Error:`error: unknown type name 'CGDirectPaletteRef'`
Fix: 这个SDL的编译错误竟然是由最新的OS X 10.9导致的，参见SDL开发版本库里的[一次提交](https://hg.libsdl.org/SDL/diff/bbfb41c13a87/src/video/quartz/SDL_QuartzVideo.h)。 这是一个月前的一个修复，看来还没有打包到稳定版本中，我就自己按照这次提交来修改代码吧。改之后make通过了. [Ref](http://blog.shengbin.me/posts/build-ffmpeg-on-os-x/)

Error: `error: conflicting types for '_XData32'`
Fix: 
[This](http://hg.libsdl.org/SDL/rev/91ad7b43317a) patch is no correct,

Following patch is right

```
# HG changeset patch
# User Azamat H. Hackimov <azamat.hackimov@gmail.com>
# Date 1370184533 -21600
# Branch SDL-1.2
# Node ID 91ad7b43317a6387e115ecdf63a49137f47e42c8
# Parent  f7fd5c3951b9ed922fdf696f7182e71b58a13268
Fix compilation with libX11 >= 1.5.99.902.

These changes fixes bug #1769 for SDL 1.2
(http://bugzilla.libsdl.org/show_bug.cgi?id=1769).

diff -r f7fd5c3951b9 -r 91ad7b43317a configure.in
--- a/configure.in	Wed Apr 17 00:56:53 2013 -0700
+++ b/configure.in	Sun Jun 02 20:48:53 2013 +0600
@@ -1169,6 +1169,17 @@
             if test x$definitely_enable_video_x11_xrandr = xyes; then
                 AC_DEFINE(SDL_VIDEO_DRIVER_X11_XRANDR)
             fi
+            AC_MSG_CHECKING(for const parameter to _XData32)
+            have_const_param_xdata32=no
+            AC_TRY_COMPILE([
+              #include <X11/Xlibint.h>
+              extern int _XData32(Display *dpy,register _Xconst long *data,unsigned len);
+            ],[
+            ],[
+            have_const_param_xdata32=yes
+            AC_DEFINE(SDL_VIDEO_DRIVER_X11_CONST_PARAM_XDATA32)
+            ])
+            AC_MSG_RESULT($have_const_param_xdata32)
         fi
     fi
 }
diff -r f7fd5c3951b9 -r 91ad7b43317a include/SDL_config.h.in
--- a/include/SDL_config.h.in	Wed Apr 17 00:56:53 2013 -0700
+++ b/include/SDL_config.h.in	Sun Jun 02 20:48:53 2013 +0600
@@ -283,6 +283,7 @@
 #undef SDL_VIDEO_DRIVER_WINDIB
 #undef SDL_VIDEO_DRIVER_WSCONS
 #undef SDL_VIDEO_DRIVER_X11
+#undef SDL_VIDEO_DRIVER_X11_CONST_PARAM_XDATA32
 #undef SDL_VIDEO_DRIVER_X11_DGAMOUSE
 #undef SDL_VIDEO_DRIVER_X11_DYNAMIC
 #undef SDL_VIDEO_DRIVER_X11_DYNAMIC_XEXT
diff -r f7fd5c3951b9 -r 91ad7b43317a src/video/x11/SDL_x11sym.h
--- a/src/video/x11/SDL_x11sym.h	Wed Apr 17 00:56:53 2013 -0700
+++ b/src/video/x11/SDL_x11sym.h	Sun Jun 02 20:48:53 2013 +0600
@@ -165,7 +165,11 @@
  */
 #ifdef LONG64
 SDL_X11_MODULE(IO_32BIT)
-SDL_X11_SYM(int,_XData32,(Display *dpy,register long *data,unsigned len),(dpy,data,len),return)
+SDL_X11_SYM(int,_XData32,(Display *dpy,register _Xconst long *data,unsigned len),(dpy,data,len),return)
 SDL_X11_SYM(void,_XRead32,(Display *dpy,register long *data,long len),(dpy,data,len),)
 #endif
 

```



----





