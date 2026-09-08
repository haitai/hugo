---
title: "Hello World"
slug: "hello-world"
#description: ""
#summary: ""
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

This article offers a sample of basic Markdown syntax that can be used in Hugo content files, also it shows whether basic HTML elements are decorated with CSS in a Hugo theme.

<!--more-->

## Headings

The following HTML `<h1>`—`<h6>` elements represent six levels of section headings. `<h1>` is the highest section level while `<h6>` is the lowest.

# H1

## H2

### H3

#### H4

##### H5

###### H6

## Paragraph

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Blockquotes

The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a `footer` or `cite` element, and optionally with in-line changes such as annotations and abbreviations.

#### Blockquote without attribution

> Tiam, ad mint andaepu dandae nostion secatur sequo quae.
> **Note** that you can use _Markdown syntax_ within a blockquote.


#### Blockquote with attribution

> Don't communicate by sharing memory, share memory by communicating.
>
> — <cite>Rob Pike[^1]</cite>


[^1]: The above quote is excerpted from Rob Pike's [talk](https://www.youtube.com/watch?v=PAAkCSZUG1c) during Gopherfest, November 18, 2015.

#### Blockquote with Hugo-admonitions

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


## Tables

Tables aren't part of the core Markdown spec, but Hugo supports them out-of-the-box.

| Name  | Age |
| ----- | --- |
| Bob   | 27  |
| Alice | 23  |

#### Inline Markdown within tables

| Italics   | Bold     | Code   |
| --------- | -------- | ------ |
| _italics_ | **bold** | `code` |

## List Types

#### Ordered List

1. First item
2. Second item
3. Third item

#### Unordered List

- List item
- Another item
- And another item

#### Nested Unordered list

- Fruit
  - Apple
  - Orange
  - Banana
- Dairy
  - Milk
  - Cheese

#### Nested Ordered list

1. Fruit
    - Apple
    - Orange
    - Banana
2. Dairy
    1. Milk
    2. Cheese
3. Third item
    1. Sub One
    2. Sub Two

## Other Elements — abbr, sub, sup, kbd, mark

<abbr title="Graphics Interchange Format">GIF</abbr> is a bitmap image format.

H<sub>2</sub>O

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

Press <kbd><kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd></kbd> to end the session.

Most <mark>salamanders</mark> are nocturnal, and hunt for insects, worms, and other small creatures.

## Syntax Highlight

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

## Github style callouts
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