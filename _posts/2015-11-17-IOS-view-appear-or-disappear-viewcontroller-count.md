---
layout: post
---

````

-(void)viewWillAppear:(BOOL)animated{
    LOGINFO(@"%ld",self.navigationController.viewControllers.count)
}
-(void)viewDidAppear:(BOOL)animated{
    LOGINFO(@"%ld",self.navigationController.viewControllers.count)
}
-(void)viewWillDisappear:(BOOL)animated{
    LOGINFO(@"%ld",self.navigationController.viewControllers.count)
}
-(void)viewDidDisappear:(BOOL)animated{
    LOGINFO(@"%ld",self.navigationController.viewControllers.count)
}

-[SettingVC viewWillDisappear:] 3
-[DevSettingVC viewWillAppear:] 3
-[SettingVC viewDidDisappear:] 3
-[DevSettingVC viewDidAppear:] 3


//goback
-[DevSettingVC viewWillDisappear:]  2
-[SettingVC viewWillAppear:] 2
-[DevSettingVC viewDidDisappear:]  0
-[SettingVC viewDidAppear:]  2


//swip goback
-[DevSettingVC viewWillDisappear:]  2
-[SettingVC viewWillAppear:]  2
-[DevSettingVC viewDidDisappear:]  0
-[SettingVC viewDidAppear:]  2


//swip goback but cancel
-[DevSettingVC viewWillDisappear:] 2
-[SettingVC viewWillAppear:]  2
-[SettingVC viewWillDisappear:]  3
-[SettingVC viewDidDisappear:]  3
-[DevSettingVC viewWillAppear:]  3
-[DevSettingVC viewDidAppear:] [ 3


````
