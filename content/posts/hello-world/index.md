---
title: "Hello World"
slug: "hello-world"
description: "这是一篇包含本主题支持的各种基本 Markdown 语法的文章。"
#summary: "这是一篇包含本主题支持的各种基本 Markdown 语法的文章。"
date: 2026-09-05T14:26:48+08:00
#lastmod: 2026-09-05T14:26:48+08:00
type: post
draft: false
tags: [test]
categories: [测试]
series: []
cover:
  image: "hello-world-cover.jpg"
  alt: "图片替代文字" # 增强 SEO
  caption: "图片说明文字" # 图片下方的说明（可选）
  relative: true # 如果你使用的是绝对路径或 static 目录，设为 false
---


<!--more-->

# 一级标题

## 二级标题

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

## 段落和文本格式

这是一个普通段落，可以包含**粗体文本**、*斜体文本*、***粗斜体文本***、~~删除线~~、`行内代码`和[链接文本](https://example.com)。

这是另一个段落，用于{{< inlinespoiler >}}测试{{</ inlinespoiler >}}段落之间的间距。

## 图片

![示例图片](/android-chrome-192x192.png "示例图片")

## 链接

这是一个[内部链接](/posts/test-backlink/)，顺便测试内部反向链接。

这是一个[外部链接](https://github.com/haitai/hugo)，它带有一个箭头图标。

这是一个[带标题的链接](https://example.com "链接标题")。

这是一个引用式链接：[引用链接][1]

[1]: https://example.com "引用链接标题"

## 脚注和旁注

这是一个包含脚注的段落[^1]。

这里是另一个脚注[^note]。

这里是一个旁注。{{< sidenote >}}
当前旁注的显示方式是：大屏上显示，小屏幕比如手机上会自动隐藏。
{{< /sidenote >}}

[^1]: 这是第一个脚注的内容。

[^note]: 这是命名脚注的内容。

## 引用块

> 这是一个简单的引用块。
> 
> 引用块可以包含多个段落。

> 这是一个嵌套引用的例子：
> 
> > 这是嵌套引用的内容。
> > 
> > 可以有多层嵌套。

### 更多引用块样式

> [!TIP]
> Warning: This operation will delete all data.

> [!NOTE] You can choose to only to show the header!

> [!TASK] ""
> This is a body-only callout without a header.

> [!MEMO]+ Click here to view the tips
> Something more.

> [!QUESTION] Can admonitions be nested?
> > [!TODO] Yes!, they can.
> > > [!EXAMPLE]  You can even use multiple layers of nesting.

## 另一种样式的 Callouts
{{< notice warning >}}
This is a warning notice. Be warned!
{{< /notice >}}

{{< notice tip "自定义标题" >}}
This is a very good tip with a different title.
{{< /notice >}}

{{< notice info >}}
This is a info notice.
{{< /notice >}}
{{< notice note>}}
This is a note notice.
{{< /notice >}}

{{< notice normal >}}
This is a very good tip with a different title.
{{< /notice >}}
## 表格

| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容 1 | 内容 2   | 内容 3 |
| 较长的内容 | 中等     | 短     |
| 数据 A | 数据 B   | 数据 C |


### 表格行内支持MD语法

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## 列表

### 无序列表

- 第一项
- 第二项
  - 嵌套项 1
  - 嵌套项 2
    - 更深层的嵌套项
- 第三项

### 有序列表

1. 第一项
2. 第二项
   1. 嵌套有序项 1
   2. 嵌套有序项 2
      1. 更深层的嵌套项
3. 第三项

### 任务列表（复选框）

- [x] 已完成的任务
- [ ] 未完成的任务
- [x] 另一个已完成的任务
- [ ] 嵌套任务列表
  - [x] 子任务 1（已完成）
  - [ ] 子任务 2（未完成）
  - [x] 子任务 3（已完成）

### 定义列表

术语 1
: 这是术语 1 的定义。

术语 2
: 这是术语 2 的定义。
: 术语可以有多个定义。


## 代码

### 行内代码

这是一个包含 `console.log('Hello World')` 的段落。
### 代码块

```javascript {lineNos=true hl_lines=[3,6,8] filename=main.js}
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}


const result = fibonacci(10);
console.log(`The 10th Fibonacci number is: ${result}`);

// Async/Await
const asyncFunction = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```
### 含文件标题代码块

```css { title=".\assets\css\extended\codeblock.css"}
.x-highlight-wrapper :nth-child(2) {
  margin-top: 0 !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

/* --hljs-bg 和 --radius 是 PaperMod 主题提供的变量 */
.x-highlight-title {
  background: var(--hljs-bg) !important;
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
  color: #e7ce56;
  padding: 4px 0 0 16px;
  font-size: .78em;
}
```

## 标签页

使用 `tabs` 和 `tab` 短代码来切换任意 Markdown 内容。

{{< tabs >}}
{{< tab "概览" >}}
这个面板里可以放普通段落、`npm run dev` 这类行内代码，以及强调文本。

- 公共说明
- 初始化清单
- 任意 Markdown 块
{{< /tab >}}
{{< tab "代码" >}}
```javascript {filename=fetch-user.js}
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error("User not found");
  return response.json();
}
```
{{< /tab >}}
{{< tab "结果" >}}
> `tabs` 短代码本身不绑定代码块。
>
> 每个面板都可以混合段落、代码块、列表、引用或图片。

{{< /tab >}}

{{< /tabs >}}


## 详情

<details>
<summary>点击展开详情</summary>

这是折叠的详细内容。

你可以在这里包含任何 Markdown 语法：

- 列表项
- **粗体文本**
- `代码`

</details>

## 其他格式 — 属性, 下标, 上标, 键盘, 高亮
<abbr title="Graphics Interchange Format">GIF</abbr> 是一种图片格式。

H<sub>2</sub>O 是水的化学分子式。

E = mc<sup>2</sup> 是爱因斯坦的质能方程。

按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 复制文本。

这是一个包含<mark>高亮文本</mark>的段落。

## PDF 渲染

{{< pdf src="attachments/test.pdf#view=Fit&page=1" width="100%" height="500px" >}}

{{< attachments folder="attachments" pattern="(test.pdf)" caption="点击下载" title="附件">}}
