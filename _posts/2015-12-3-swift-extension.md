---
layout: post
---

[swift+extension](https://github.com/ygweric/swift-extension)
#swift+extension

----

`ActionKit` is base on [ActionKit/ActionKit](https://github.com/ActionKit/ActionKit), not my CopyRight

----

**If you have any good idea, mail me , I will add it**

----

### Extension for UIView

#### Change `height`, or others, such as `x, y, width, origin, center`

without extension 

````
view.frame = CGRectMake(view.frame.origin.x, view.frame.origin.y, view.frame.size.width, 12)

or
CGRect frame= view.frame
frame.size.height=12
view.frame=frame
````

with extension 

````
view.height = 12
````


### Extension for String

method list

````
func containsString(s:String) -> Bool
func containsString(s:String, compareOption: NSStringCompareOptions) -> Bool
var isNilOrEmpty
var emptyIfNil
````


### Extension for UIButton

easy with to create button

there are lots of default parameters value.

````
convenience init(
        frame_:CGRect? = nil,
        imgName:String? = nil,
        hlImgName:String? = nil,
        disabledImageName:String? = nil,
        title:String? = nil,
        titleColor:UIColor? = nil,
        hlTitleColor:UIColor? = nil,
        disabledTitleColor:UIColor? = nil,
        font:UIFont? = nil,
        backgroundColor:UIColor? = nil,
        hlBackgroundColor:UIColor? = nil,
        titleEdgeInsets:UIEdgeInsets? = nil,
        contentHorizontalAlignment:UIControlContentHorizontalAlignment? = nil,
        block:((btn:UIControl)->Void)? = nil
        ){
        ....
        }
````





### Extension for UITextField

easy with to create button

there are lots of default parameters value.

````
convenience init(
        frame_:CGRect = CGRectZero,
        font:UIFont? = nil,
        placeholder:String? = nil,
        placeholderColor:UIColor? = nil,
        placeholderFont:UIFont? = nil,
        delegate:UITextFieldDelegate? = nil,
        textColor:UIColor? = nil,
        keyboardType:UIKeyboardType = .Default
        ){
        ....
        }
````


### Extension for UILabel

easy with to create button

there are lots of default parameters value.

````
 convenience init(
        frame_:CGRect = CGRectZero,
        text:String? = nil,
        font:UIFont? = nil,
        textColor:UIColor? = nil,
        backgroundColor:UIColor = UIColor.clearColor(),
        textAlignment:NSTextAlignment = .Left,
        userInteractionEnabled:Bool = false
        ){
        ....
        }
````

### Extension for UIImage

init image with color

there are lots of default parameters value.

````
convenience init(color: UIColor, size: CGSize = CGSizeMake(1, 1)) {...}
````





#### GlobleFunction

in `GlobleFunction`, with [QorumLogs](https://github.com/goktugyil/QorumLogs), you can  create different log level


I also define some useful var and func such as

````
var SCREEN_SCALE:CGFloat { return UIScreen.mainScreen().bounds.size.width/320}
var SCREEN_WIDTH:CGFloat { return UIScreen.mainScreen().bounds.size.width}
var SCREEN_HEIGHT:CGFloat { return UIScreen.mainScreen().bounds.size.height}

var STATUS_BAR_HEIGHT:CGFloat { return 20}
var NAV_BAR_HEIGHT:CGFloat { return 44}
var NAV_BAR_HEIGHT_IOS7:CGFloat { return 64}
var NAV_BAR_HEIGHT_PLUS:CGFloat { return 93}
var TOOL_BAR_HEIGHT:CGFloat { return 44}
var TAB_BAR_HEIGHT:CGFloat { return 49}

func COLORRGB(rgbValue: UInt) -> UIColor {}
func COLORRGBA(rgbValue: UInt, _ alphaValue: Float) -> UIColor {}

````









