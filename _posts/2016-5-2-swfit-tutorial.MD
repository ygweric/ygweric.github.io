---
layout: post
published: true
title:  "Swift project tutorial"
date:   2016-5-2 00:00:00 +0700
categories: IT
tags:
- Android
- IT
---



You Should Know

* 移植的所有swift文件,均在文件后面加`S.swift`来区分,免得引起类名冲突
* Swift编译器语法检查很多,枕着Xcode提示修改就好
* 大部分swift和objc混编没问题的,但有时候(如modle),会出现各种错误,如重复定义class,function等,或者MantleModel 和json转换出问题. 遇到错误请google

----

# 参考资料

### 官方语法 [The Swift Programming Language](https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/) 

### Swift 和 ObjC混编 [Using Swift with Cocoa and Objective-C (Swift 2.1)](https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/BuildingCocoaApps/)


### Swift语法规范
* [github/swift-style-guide](https://github.com/github/swift-style-guide)
* [raywenderlich/swift-style-guide](https://github.com/raywenderlich/swift-style-guide)



### [Swift Cocoachina专题](http://www.cocoachina.com/swift/)



### [Swift源码](https://swift.org/download/#latest-development-snapshots)


----


# [Access Control][Access Control]
[Access Control]:https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/AccessControl.html



默认 Access Levels: **internal**


推荐写法:

````
public var whoopsGlobalState: Int
internal struct TheFez {}
private func doTheThings(things: [Thing]) {}
````

----

# 宏

C的宏要求名字大写,但Swift没有宏,有全局函数&变量,使用驼峰命名,不过为了ObjC --> Swift项目移植方便,全部用swfit的全局变量和函数使用**全大写方式书写**,等全部移植结束后,全局替换成小写的


swfit常量用let声明

OjbC宏:

````
//函数
define COLORRGB(c)    [UIColor colorWithRed:((c>>16)&0xFF)/255.0	\
                                         green:((c>>8)&0xFF)/255.0	\
                                         blue:(c&0xFF)/255.0         \
                                         alpha:1.0]
                                         
define USERS_USER(user_id)             ([NSString stringWithFormat:@"users/%@",(user_id)])
define USERS_APPLY(user_id,apply_type) ([NSString stringWithFormat:@"%@users/%d/verify?type=%d&user_id=%d",(BASE_URL),(user_id),(apply_type),(user_id)])


//常量
define PADDING   5
define HANDSON_SQUARE       @"handson/products"
define HANDSON_SCENES       @"users/scenes"

````
Swift使用全局函数&变量:

````
//函数

func COLORRGBA(rgbValue: UInt, _ alphaValue: Float) -> UIColor {
    return UIColor(
        red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
        green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
        blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
        alpha: CGFloat(alphaValue)
    )
}

func USERS_USER(user_id:String) -> String{ return "users/\(user_id)" }
func USERS_APPLY(user_id:String,apply_type:String) -> String { return "\(BASE_URL)users/\(user_id)/verify?type=\(apply_type)&user_id=\(user_id)" }


//常量
let PADDING:CGFloat {return 5}
let HANDSON_SCENES   :String     {  return "users/scenes" }
let USERS_ME       :String    {  return "users/me" }

````


----

# 函数默认值



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
        //xxx
        }
 let findNav = UILabel(frame_: CGRectMake(0, 0, 150, 40) , text: "找回密码", font: HSFONT(15), textColor: UIColor.whiteColor(), 
 ````
 

----

# CocoaPods

Podfile

````
platform :ios, '8.0'
use_frameworks!
````



----

# MTLModel --> ObjectMapper

`MTLModel` 在swfit上会有各种莫名奇妙的错误,后来索性都换成 [`ObjectMapper`](https://github.com/Hearst-DD/ObjectMapper), 后期调试和维护也方便


#### Model Class
[Java 批量转换`MTLModel`-> `ObjectMapper`](https://gist.github.com/ygweric/f1a274ca620a049c9bbd)


ObjC:

````
@interface HandsOnModel : MTLModel<MTLJSONSerializing>

@property (nonatomic, strong)NSString *name;
@property (nonatomic, strong)User *user;

@end


@implementation HandsOnModel

// >>> Swift 不需要指出类名
+ (NSValueTransformer *)userJSONTransformer {
    return [MTLJSONAdapter arrayTransformerWithModelClass:[User class]];
}

@end
````

Swift: 不需要指出类名

````
class HandsOnModelS: Mappable{
    var user: User?
    var name: String?


    required init?(_ map: Map) {

    }

    // Mappable
    func mapping(map: Map) {
        user <- map["user"]
        name <- map["name"]
    }
}
````

#### Model 解析

````
 _handsOnStore = [MTLJSONAdapter modelOfClass:[HandsOnStore class]
                                  fromJSONDictionary:data
                                               error:nil];
````

Swift:

````
let handsOnStore = Mapper<HandsOnStoreS>().map(responseObject)
````


----

# Protocal

**父类实现protocal以后,子类不可以在explicit 集成protocal**

Swift的protocal,创建和objc几乎一样,使用时候可以直接当做类来用,看不出区别

ObjC:`@property (nonatomic, strong) id<XYHandsOnCellDelegate>delegate;`

Swift:`var delegate: XYHandsOnCellDelegateS?`


#### protocal实现判断
objc 需要检查两次

````
if (self.delegate 
	&& [self.delegate respondsToSelector:@selector(didClickApplyButtonAction:)]) {
                                                  [self.delegate didClickApplyButtonAction:self];
                                              }
````

swift用`?`就好

`self.delegate?.didClickApplyButtonAction?(self)`

----

# self的使用
默认不使用self
* 在closure里面才强制需要
* setter 方法 使用



objc的成员变量默认是`_xxx`,没有问题,swift成员变量默认没有下划线`xxx`,
因此在开发总会遇到下面问题:

局部变量和成员变量都是`handsOnStore`,在调用时候出错了,我找了半天.

````

 let handsOnStore = Mapper<HandsOnStoreS>().map(responseObject)
            if (handsOnStore!.data!.count > 0) {
                tableView.beginUpdates()
                var indexs = [NSIndexPath]()
                for (index, _) in handsOnStore!.data!.enumerate(){
                    indexs.append(NSIndexPath(forRow: self.handsOnStore!.data!.count + index, inSection: 0))
                }
      

                tableView.insertRowsAtIndexPaths(indexs, withRowAnimation: .Automatic)
                self.handsOnStore!.addDataWith(handsOnStore!.data!)
                self.handsOnStore!.updatePagerWith(handsOnStore!.links!)
                tableView.endUpdates()
            }

````

开发建议:**局部变量不要和成员变量名字一样,尽量用简写**

比如,(个人习惯)

|类|变量名|
|---|---|
|UIButton|btXxx|
|UIView|vXxx|
|UITableView|tbXxx|
|UITextView|tvXxx|
|UIlabel|lbXxx|
|...|...|


----

# 移植Tips
![objc-swift-code2code]({{ site.url }}/assets/image/2016-5-2-objc-swift-code2code.png)

1. 创建类文件,`xxxxS.swift`结尾
2. copy所有变量&函数,保持函数为空,先编译过再说.**函数顺序不要变化,免得漏掉**
3. 逐个实现函数,逐行翻译,数据结构和顺序尽量别变,免得因此疏漏的bug,只管翻译
4. 先将新文件应用到一处,调通编译
5. 全局替换新文件,旧文件移出target

 **swfit的新功能,比如`tuple`等全部移植完在优化,免得出错**

****

----

# getter & Setter

#### getter简洁写法

`var SQUARE_POST  :String   {  return "board/posts" }`


#### 完整写法
`newValue` 是缺省的set值

````
  var diameter: Double {
    get {
      return radius * 2
    }
    set {
      radius = newValue / 2
    }
  }
````

----

# = 等号
`=`大部分左右要有空格,因为等号会和其他符号连一块,编译器报错



----

# ? & !

OC中成员变量不出为nil的也可以直接调用,xcode不会报错,但可能会crash

swift中如果没有初始化,会报错

* **? Optional Type** 进行错误检查,如果nil,就不往下执行
* **! Implicitly Unwrapped Optional Type** 直接断定非nil,直接往下执行

----

# [Objective-C & Swift 混用][ObjC & Swift Mix]

[ObjC & Swift Mix]:https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html#//apple_ref/doc/uid/TP40014216-CH10-ID122

## Importing Objective-C into Swift

* 创建 `XYDemo-Bridging-Header.h`


````
#import "XYAPIClient.h" 
#import "HTEmailAutocompleteTextField.h"
#import "RDVTabBarController.h"
````

## Importing Swift into Objective-C

需要的文件`#import "XYDemo-Swift.h"`

 **下面的方法**可能引起`.h`重复引用的错误,当时没想到原因,后来也没有测试,以后有机会留意一下
 
`XYDemo-Prefix.pch`中引用 `#import "XYDemo-Swift.h"`

	
||Import into Swift | Import into Objective-C| 
|---|---|---|
|Swift code|No import statement|#import "ProductModuleName-Swift.h"|
|Objective-C code|No import statement; Objective-C bridging header required|#import "Header.h"|


----

swift 调用framework, `import FrameworkName`

----

# PlayGround

学习语言用的,但不能在项目中使用


----

# Enumerations

enum名字不再以type开头.

````
//objc
typedef NS_ENUM(NSInteger, UIButtonType) {
    UIButtonTypeCustom = 0,                         // no button type
    UIButtonTypeSystem NS_ENUM_AVAILABLE_IOS(7_0),  // standard system button

    UIButtonTypeDetailDisclosure,
    UIButtonTypeInfoLight,
    UIButtonTypeInfoDark,
    UIButtonTypeContactAdd,
    
    UIButtonTypeRoundedRect = UIButtonTypeSystem,   // Deprecated, use UIButtonTypeSystem instead
};

//swfit
public enum UIButtonType : Int {
    
    case Custom // no button type
    @available(iOS 7.0, *)
    case System // standard system button
    
    case DetailDisclosure
    case InfoLight
    case InfoDark
    case ContactAdd
    
    public static var RoundedRect: UIButtonType { get } // Deprecated, use UIButtonTypeSystem instead
}

````

----

# NSArray & NSMutableArray

用let和var区分


````
//NSArray
let links = ["nihao","hello"]

//NSMutableArray
var links = ["nihao","hello"]

````


----

# String 格式化

````
//objc
NSString *str = [NSString stringWithFormat:@"%d , %f, %ld, %@", INT_VALUE, FLOAT_VALUE, DOUBLE_VALUE, STRING_VALUE];

//swift
print("\(mansionCount) mansion scenes; \(cellCount) cell scenes")
````

----

# 成员变量初始化

objc 并不检查成员变量是否初始化,swift检查的有点变态的仔细 F**k

#### 各种错误

````
//swift code
var isFromMyHandson:Bool


//Error description
Class 'XYHandsOnVCS' has no initializers
````
````
//swift code
var isFromMyHandson:Bool!
print(isFromMyHandson)


//Error description
fatal error: unexpectedly found nil while unwrapping an Optional value
````

#### 声明建议:

````
var isFromMyHandson:Bool! = false
var isFromMyHandson:Bool?
````
