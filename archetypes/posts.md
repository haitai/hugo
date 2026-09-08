---
title: "{{ $n := .File.ContentBaseName }}{{ if gt (len $n) 11 }}{{ $n = substr $n 11 }}{{ end }}{{ replace $n "-" " " | title }}"
#description: ""
#summary: ""
slug: "{{ $n := .File.ContentBaseName }}{{ if gt (len $n) 11 }}{{ $n = substr $n 11 }}{{ end }}{{ replace $n " " "-" | strings.ToLower }}"
date: {{ .Date }}
type: post
draft: false
tags: []
categories: []
series: []
---
