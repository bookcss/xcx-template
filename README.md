

# 微信小程序模板介绍

> github地址：[https://github.com/hwgq2005/xcx-template](https://github.com/hwgq2005/xcx-template "微信小程序模板")

### 一、目录结构
├── component
|   ├── select-address
├── images
├── pages
|   ├── page1
|   └── page2
├── utils
|   ├── common.js
|   ├── host.js
|   ├── reg.js
|   ├── request.js
|   └── sign.js
├── wxml
|   ├── aaa.wxml
|   └── bbb.wxml
├── wxss
|   ├── common.wxss
|   ├── header.wxss
|   └── sidebar.wxss
└── wxParse

#### 1.component
主要存放组件模块，可自行添加。
组件需要在页面里的 `xxx.json` 文件下配置组件路径，如下：
```
{
	"navigationBarTitleText": "标题",
    "usingComponents":{
    	"select-address":"../../component/select-address/select-address"
    }
}
```
#### 2.utils
封装了公共的模板，可以看到以下这些文件：
- [x] request.js - 请求封装
- [x] sign.js - 请求签名参数
- [x] host.js - 域名环境控制
- [x] reg.js - 正则匹配验证
- [x] common.js - 公共方法

#### 3.wxParse
主要是用来解析HTML。
```
import WxParse from '../../wxParse/wxParse'

WxParse.wxParse('名称定义', 'html', data.data.rules, this, 5);
```
WxParse.wxParse(bindName , type, data, target,imagePadding)
- bindName绑定的数据名(必填)
- type可以为html或者md(必填)
- data为传入的具体数据(必填)
- target为Page对象,一般为this(必填)
- imagePadding为当图片自适应是左右的单一padding(默认为0,可选)

引入模板
```
<import src="../../wxParse/wxParse.wxml"/>

<!--bindName-->
<template is="wxParse" data="{{wxParseData:名称定义.nodes}}"/>
```
### 二、请求调用

#### 1.通用方式

```
import $ from '../../utils/request'

$.ajax({
    url: _.host.baseApi + '/api/xxx',
    method: 'post',
    data: {}
}).then(function(data){
    if (data.code == 1) {
    	...
    	do somethig ...
    }
}).catch(function(err){
    
})
```
#### 2.GET请求
```
import $ from '../../utils/request'

$.get({
    url: _.host.baseApi + '/api/xxx',
    data: {}
}).then(function(data){
    if (data.code == 1) {
    	...
    	do somethig ...
    }
}).catch(function(err){
   
})
```
#### 3.POST请求
```
import $ from '../../utils/request'

$.post({
    url: _.host.baseApi + '/api/xxx',
    data: {}
}).then(function(data){
    if (data.code == 1) {
    	...
    	do somethig ...
    }
}).catch(function(err){
    
})
```
#### 4.参数说明
| 字段   |  字段说明 |
|:------|:-------:|
| method  | get或post，默认值为get | 
| data  | isSign等于true或false，默认值为false，可根据情况删减。 |

### 三、域名环境控制
```
// 是否开发环境
let isDev = false;

// 开发环境域名
let dev = {
  // 商城API
  baseApi : 'xxx1.com',
  // 抽奖api
  drawApi :  'xxx2.com'
}

// 线上环境域名
let pro = {
  // 商城API
  baseApi : 'xxx3.com',
  // 抽奖api
  drawApi :  'xxx4.com'
}
```

### 四、结尾

以上只提供目录模板，及公共方法，其他需自行开发。
微信小程序开发文档：[https://developers.weixin.qq.com/miniprogram/dev/reference/](https://developers.weixin.qq.com/miniprogram/dev/reference/ "微信小程序开发文档")
