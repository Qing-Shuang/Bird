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
* 织入（Weaving），把切面应用到目标对象来创建新的代理对象的过程，切面在指定连接点织入到目标对象。有以下时机可织入：编译时、类加载时、运行时。

## Spring AOP织入切面的方式 ##

Spring利用代理类包裹切面，从而把它们织入到Spring管理的Bean里。代理类装作目标Bean，截取被通知的方法调用，再把这些调用转发给真正的目标Bean。在代理截取方法调用之后、实际调用目标Bean的方法之前，代理会执行切面逻辑。

Spring直到程序需要被代理的Bean时才会创建它。如果使用的是ApplicationContext，被代理的对象会在它从BeanFactory加载全部Bean时被创建。由于Spring是在运行时创建代理，所以我们不需要使用特殊的编译器把切面织入到Spring的AOP。

Spring生成被代理类的方式有两种：

* 如果目标对象实现的是一个接口，Spring会使用JDK的java.lang.reflect.Proxy类，它允许Spring动态生成一个新类来实现必要的接口、织入任何通知、并且把对这些接口的任何调用都转发到目标类。
* 如果目标类不是实现一个接口，Spring就使用CGLIB库生成目标类的一个子类。在创建这个子类时，Spring织入通知，并且把对这个子类的调用委托到目标类。

创建接口的代理能够更好地实现程序的松耦合。创建子类的方式存在“目标类中被标记为final的方法不能被通知”的限制。

