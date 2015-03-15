---
layout: default
tags: struts
title: Struts 学习笔记(4)--声明拦截器
---

# Struts 学习笔记(4)--声明拦截器 #

## 将拦截器映射到动作组件 ##

大多数时候，你的动作会属于某个扩展了struts-default的包，并且会满足让它们使用从这个包继承来的defaultStack的拦截器。

为了修改、变更或者仅仅是增强默认的拦截器栈，可以使用interceptor-ref元素完成拦截器和动作的关联。只要动作声明了自己的拦截器，它就失去了自动的默认值，并且为了使用defaultStack就必须显式指出，同时这个动作必须在一个扩展了struts-default的包。

## 其他 ##

拦截器实例在动作之间共享。虽然每一个请求都会创建动作的一个新实例，但是拦截器会重用。拦截器是无状态的，不要在拦截器中存储与当前正在处理的请求相关的数据，这不是拦截器的职责。拦截器应该只把它的处理逻辑应用在请求数据上，你可以通过ActionInvocation访问这些已经方便地存储在不同对象上的数据。

`getInvocationContext()` 方法返回与请求相关的ActionContext对象。ActionContext为处理请求包含了很多重要的数据对象，包括ValueStack以及Servlet API中的关键对象。
