---
layout: post
published: true
title:  "iOS UI code snippet"
date:   2015-11-14 00:00:00 +0700
categories: it
tags:
- it
- ios
---

####  UILabel

```
[EYTextPopupView popViewWithTitle:@"我是标题" contentText:@"我是正文"
                                                    leftButtonTitle:@"左键"
                                                    rightButtonTitle:@"右键"
                                                          leftBlock:^() {
                                                              NSLog(@"left button clicked");
                                                          }
                                                         rightBlock:^() {
                                                             NSLog(@"left button clicked");
                                                         }
                                                       dismissBlock:^() {
                                                           NSLog(@"Do something interesting after dismiss block");
                                                       }];

```




```
 {
        UILabel* lb =[[UILabel alloc]initWithFrame:CGRectZero];
        lb.autoresizingMask=UIViewAutoresizingFlexibleWidth;
        _lbEmptyInfo=lb;
        lb.frame=CGRectMake(100, 100, 100, 14);
        lb.textColor=COLORRGB(0x1e1e1e);
        lb.textAlignment=NSTextAlignmentLeft;
        lb.backgroundColor=[UIColor clearColor];
        lb.font=[UIFont systemFontOfSize:12];
        lb.text=@"还没有发布任何约伴信息哦!";
        [self.view addSubview:lb];
        
    }
       
```

#### UIButton

```
 
    {
        UIButton* bt =[UIButton buttonWithType:UIButtonTypeCustom];
        bt.autoresizingMask=UIViewAutoresizingFlexibleWidth;
        [bt setBackgroundImage:[[UIImage imageNamed:@"yb_bt_bg_1_nor@2x"] resizableImageWithCapInsets:UIEdgeInsetsMake(5, 5, 5, 5)] forState:UIControlStateNormal];
        _btEmptyCreate=bt;
        bt.frame=CGRectMake(100, 100, 100, 30);
        [bt addTarget:self action:@selector(forwardCreatePostVC:) forControlEvents:UIControlEventTouchUpInside];
        bt.backgroundColor=[UIColor clearColor];
        bt.titleLabel.font=[UIFont systemFontOfSize:12];
        [bt setTitle:@"立即发布" forState:UIControlStateNormal];
        [bt setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [self.view addSubview:bt];
        
    }


```



#### UIView
 
```
{
            UIView* v=[UIView new];
            v.frame=CGRectMake(100, 100, 100, 30);
            v.autoresizingMask=UIViewAutoresizingFlexibleWidth;
            v.backgroundColor=COLORRGB(0xd1d4d4);
            [self.view addSubview:v];

        }
        
```


#### UIImageView
```
{
            UIImageView* iv =[UIImageView new];
            iv.frame=CGRectMake(0, 0, 35, 35);
            iv.autoresizingMask=UIViewAutoresizingFlexibleWidth;
            iv.backgroundColor=[UIColor clearColor];
            iv.image=[UIImage imageNamed:@"search-calendar-icon"];
            [self.view addSubview:iv];
        }
        
```

#### UITableView
```     
{
        UITableView* tb=[[UITableView alloc]initWithFrame:self.view.bounds];
        self.tbItems=tb;
        tb.tableFooterView=[UIView new];
        tb.autoresizingMask=UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight;
        tb.separatorColor=COLORRGB(0xd6d6d6);
        tb.separatorStyle=UITableViewCellSeparatorStyleNone;
        tb.delegate=self;
        tb.dataSource=self;
        tb.backgroundColor=MAIN_SECTION_BG_COLOR;
        [self.view addSubview:tb];
    }

```

#### UITextView
```
{
          UITextView* tv=[[UITextView alloc]initWithFrame:CGRectZero];
            tv.frame=CGRectMake(10, 10, 100, 100);
            tv.tag=TAG_CELL_TV_NOTE;
            tv.textColor=COLORRGB(0x606565);
            tv.textAlignment=NSTextAlignmentRight;
            tv.backgroundColor=[UIColor clearColor];
            tv.font=[UIFont systemFontOfSize:12];
            [cell.contentView addSubview:tv];
        }
        
```

#### UISwitch
```
 {
            UISwitch* sw=[[UISwitch alloc]initWithFrame:CGRectZero];
            sw.frame=CGRectMake(cell.frame.size.width-33-10, (45-20)/2, 33, 20);
            sw.autoresizingMask=UIViewAutoresizingFlexibleRightMargin;
            [sw addTarget:self action:@selector(handlerSwitchEvent:) forControlEvents:UIControlEventValueChanged];
            sw.tag=TAG_CELL_SW_SWITCH;
            sw.onTintColor=MAIN_COLOR_2;
            [cell.contentView addSubview:sw];
        }
```

#### UITableViewCell
```
  UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"Cell"];
    if (!cell)
    {
        cell=[[UITableViewCell alloc]initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"Cell"];
            cell.selectionStyle=UITableViewCellSelectionStyleNone;
    }

```

#### UITextField
```
 {
            UITextField* tf=[[UITextField alloc]initWithFrame:CGRectZero];
            tf.frame=CGRectMake(80, 16, cell.frame.size.width-80-10, 15);
            tf.tag=TAG_CELL_TF_VALUE;
            [tf addTarget:self action:@selector(textFieldDidChange:) forControlEvents:UIControlEventEditingChanged];
            tf.borderStyle=UITextBorderStyleNone;
            tf.textColor=COLORRGB(0x787c7c);
            tf.textAlignment=NSTextAlignmentRight;
            tf.backgroundColor=[UIColor clearColor];
            tf.font=[UIFont systemFontOfSize:13];
            [cell.contentView addSubview:tf];
        }

```

#### EYTagView
```
{//tag flow
        EYTagView* tag=[[EYTagView alloc]initWithFrame:CGRectZero];
        tag.frame=CGRectMake(100,(45-28)/2, SCREEN_WIDTH-100-25, 30);
        tag.tag=TAG_HEADER_V_LOCATION_FLOW;
        tag.type=EYTagView_Type_Flow;
        [APPDELEGATE configEYTagViewLocationFlowStyle:tag];
        tag.numberOfLines=1;
        tag.delegate=self;
        [APPDELEGATE configEYTagViewStyle:tag];
        [_vTableHeader addSubview:tag];
    }

```



## layout



#### UILabel size

##### 忽略 linenumber ，得到最大的size
```
{
        UILabel* lb=(id)[_vTableHeader viewWithTag:TAG_HEADER_LB_REMARK];
        lb.backgroundColor=TEST_COLOR_RED;
        CGSize maximumLabelSize = CGSizeMake(lb.frame.size.width,1000);
        NSDictionary *attributesDictionary = [NSDictionary dictionaryWithObjectsAndKeys:lb.font,NSFontAttributeName,nil];
        NSMutableAttributedString *string = [[NSMutableAttributedString alloc] initWithString:lb.text attributes:attributesDictionary];
        CGRect newFrame = [string boundingRectWithSize:maximumLabelSize options:NSStringDrawingUsesLineFragmentOrigin context:nil];
        CHANGE_FRAME_HEIGTH(lb, newFrame.size.height);
        CHANGE_FRAME_Y(lb, CGRectGetMaxY([_vTableHeader viewWithTag:TAG_HEADER_V_LOCATION_FLOW].frame)+8)
    }

```

##### 当linenumber>1时候，得到size

```
{
        UILabel* lb=(id)_lbSignature;
        CGSize maximumLabelSize = CGSizeMake(lb.frame.size.width,1000);
         CGSize newSize =[lb sizeThatFits:maximumLabelSize];
        CHANGE_FRAME_HEIGHT(lb, newSize.height)
    }
```

```
{
        UILabel* lb=(id)[_vTableHeader viewWithTag:TAG_HEADER_LB_NAME];
        CGSize maximumLabelSize = CGSizeMake(1000, lb.frame.size.height);
        NSDictionary *attributesDictionary = [NSDictionary dictionaryWithObjectsAndKeys:lb.font,NSFontAttributeName,nil];
        NSMutableAttributedString *string = [[NSMutableAttributedString alloc] initWithString:lb.text attributes:attributesDictionary];
        CGRect newFrame = [string boundingRectWithSize:maximumLabelSize options:NSStringDrawingUsesLineFragmentOrigin context:nil];
        CHANGE_FRAME_WIDTH(lb, newFrame.size.width);
    }

```

#### TTTAttributedLabel size
```
{
        TTTAttributedLabel* lb=(id)[_vTableHeader viewWithTag:TAG_HEADER_LB_REMARK];
        lb.backgroundColor=TEST_COLOR_RED;
        CGSize maximumLabelSize = CGSizeMake(lb.frame.size.width,1000);
        CGSize newSize= [lb sizeThatFits:maximumLabelSize];
        CHANGE_FRAME_HEIGTH(lb, newSize.height);
        CHANGE_FRAME_Y(lb, CGRectGetMaxY([_vTableHeader viewWithTag:TAG_HEADER_V_LOCATION_FLOW].frame)+8)
    }
```

```

  {
        UILabel* lb=(id)[_vTableHeader viewWithTag:TAG_HEADER_LB_BROWSE_COUNT];
        CGSize maximumLabelSize = CGSizeMake(1000, lb.frame.size.height);
        NSDictionary *attributesDictionary = [NSDictionary dictionaryWithObjectsAndKeys:lb.font,NSFontAttributeName,nil];
        NSMutableAttributedString *string = [[NSMutableAttributedString alloc] initWithString:lb.text attributes:attributesDictionary];
        CGRect newFrame = [string boundingRectWithSize:maximumLabelSize options:NSStringDrawingUsesLineFragmentOrigin context:nil];
        CHANGE_FRAME_WIDTH(lb, newFrame.size.width+2);//HERE: text is clip, why ??
        CHANGE_FRAME_X(lb,  CGRectGetMinX([_vTableHeader viewWithTag:TAG_HEADER_IV_COMMENT_ICON].frame) - lb.frame.size.width -8);
        CHANGE_FRAME_Y(lb, CGRectGetMinY([_vTableHeader viewWithTag:TAG_HEADER_LB_COMMENT_COUNT].frame))
    }
    {
        UIView* v=(id)[_vTableHeader viewWithTag:TAG_HEADER_IV_READ_ICON];
        CHANGE_FRAME_X(v, CGRectGetMinX([_vTableHeader viewWithTag:TAG_HEADER_LB_BROWSE_COUNT].frame) - v.frame.size.width-3)
        CHANGE_FRAME_Y(v, CGRectGetMinY([_vTableHeader viewWithTag:TAG_HEADER_LB_COMMENT_COUNT].frame))
    }

```