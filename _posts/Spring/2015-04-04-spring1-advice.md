---
layout: default
tags: spring
title: Spring学习笔记1-通知bean
---

# Spring学习笔记1-通知bean #

摘录于[《Spring in Action》](http://book.douban.com/subject/3208666/)

## AOP术语 ##

* 通知（Advice），定义了切面是什么以及何时使用。
* 连接点（Joinpoint），是在程序执行过程中能够插入切面的一个点。
* 切入点（Pointcut），一个切面不是一定要通知程序里全部的连接点。切入点可以缩小切面通知的连接点的范围。切入点定义了“何地”。
* 切面（Aspect），切面是通知和切入点的结合，在何时和何地完成其功能。
* 引入（Introduction），允许我们向现有的类添加新方法或属性。
* 目标（Target），被通知的对象。
* 代理（Proxy），是向目标对象应用通知之后被创建的对象。
* 织入（Weaving），把切面应用到目标对象来创建新的代理对象的过程，切面在指定连接点织入到目标对象。

