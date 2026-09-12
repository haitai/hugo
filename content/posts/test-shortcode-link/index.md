---
title: "测试内链卡片"
#description: ""
#summary: ""
slug: "test-shortcode-link"
date: 2026-09-12T11:10:29+08:00
type: post
draft: false
tags: [test]
categories: [测试]
series: []
---
测试内链卡片显示。使用以下代码引入内链卡片：
```html
{ {<inlink "/posts/hello-world/">} } <!-- 使用时删除花括号中的空格 -->
```
测试文章显示： {{<inlink "/posts/hello-world/">}}
测试微博显示：  {{<inlink "/statuses/2026-09-11-174539/">}}
