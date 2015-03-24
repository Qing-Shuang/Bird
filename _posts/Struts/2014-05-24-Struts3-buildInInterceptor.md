---
layout: default
tags: struts
title: Struts 学习笔记(3)--内建的Struts拦截器
---

# Struts 学习笔记(3)--内建的Struts拦截器 #

## 工具拦截器 ##

* timer拦截器。记录执行花费的时间，在拦截器栈中的位置决定了它实际测量什么时间。
	
* logger拦截器。记录了在预处理时的进入声明以及在后加工时的推出声明。
	
## 数据转移拦截器 ##

### params拦截器（defaultStack）###
 
它将请求参数转移到通过ValueStack公开的属性上。params拦截器**不知道**这些数据最终回去哪里，它只是把数据转移到在ValueStack上发现的**第一个**匹配的属性上。 **因此正确的对象如何及时到达ValueStack接受数据转移呢？**动作总是在请求处理周期开始时被放到ValueStack上。模型（由 `ModelDriven` 接口公开）被modelDriven拦截器放在ValueStack上。
	
### static-params拦截器（defaultStack）### 

这个拦截器也将参数转移到ValueStack公开的属性上，不同的是这个拦截器转移的参数定义在声明性架构的动作元素中。在defaultStack中static-params拦截器在params拦截器之前触发，这意味着请求参数会覆盖XML中 `param` 元素的值。

### autowiring拦截器 ### 

这个拦截器为使用Spring管理应用程序资源提供了一个集成点。这是设置动作上的属性的另一种方法。

### servlet-config拦截器（defaultStack）### 

这个拦截器通过将Servlet API的各种对象设置到动作必须实现的**接口公开的设置方法**的方式工作。每个接口包含了一个方法--当前资源的设置方法。servlet-config拦截器在预处理阶段将这些对象放到动作上。最佳实践建议避免使用Servlet API对象，因此它会将动作代码绑定到Servlet API。
	
* ServletContextAware 设置 ServletContext
* ServletRequestAware 设置 HttpServletRequest
* ServletResponseAware 设置 HttpServletResponse
* ParameterAware 设置Map类型的请求参数
* RequestAware 设置Map类型的请求属性
* SessionAware 设置Map类型的会话属性
* ApplicationAware 设置Map类型的应用程序领域属性
* PrincipalAware 设置Principal对象（安全相关）
（以上接口在 `org.apache.struts2.interceptor` 包内）


### fileUpload拦截器（defaultStack）### 
这个拦截器将文件和元数据从多重请求转换为常规的请求参数。
	
## 工作流拦截器 ##

工作流拦截器提供改变请求处理的工作流的机会，这里的工作流是贯穿拦截器、动作、结果，最后又回到拦截器检查处理的路径。

### workflow拦截器（defaultStack）### 

这个拦截器与动作协作，提供数据验证（ `Validateable` 接口下的 `validate()` 方法）以及验证错误（ `ValidationAware` 接口下的 `hasErrors()` 方法）发生时改变后续工作流的功能。

	为什么数据验证和验证错误在不同的接口？
	这是因为下文将提到另一种实现数据验证的方法，validation拦截器，这个拦截器将发生的验证错误也存储在相同的位置。
	这样workflow拦截器不需要知道这些错误信息的来源，并拥有多种数据验证的方式。
	
这个拦截器还可以使用params调整拦截器的执行。有以下参数：
	
* alwaysInvokeValidate，true或者false，默认是true，意思是validate()方法将会被调用。
* inputResultName，验证失败时选择的结果的名字，默认值是Action.INPUT。
* excludeMethods，workflow不应该执行的方法名，这样可以省略动作上的一个特定入口方法的验证检查。

	
	注意这里的params和上文的params拦截器是两回事，两者没有任何联系噢^_^。

### validation拦截器（defaultStack）### 

这个拦截器是Struts2验证框架的一部分，提供了声明性的方式验证你的数据（使用XML或者java注解描述数据的验证规则）。validation拦截器是验证框架处理的入口点。这个拦截器在workflow拦截器之前触发，这个顺序有defaultdefaultStack处理。

### prepare拦截器（defaultStack）###

这个拦截器提供了一种向动作追加额外工作流的通用入口点，当prepare拦截器执行时，它在动作（实现了 `Preparable` 接口）上查找 `prepare()` 方法。

这个拦截器可以为同一个动作上多个执行入口点定义特别的预备逻辑。有以下约定：

动作方法名 | 预处理方法1 | 预处理方法2
--- | --- | ---
input() | prepareInput() | prepareDoInput()
update() | prepareUpdate() | preparDoeUpdate()

这个拦截器的参数 `alwaysInvokePrepare` 可以关闭 `prepare()` 方法的调用。

Preparable接口在动作执行之前创建资源或者数字时非常有用。

### modelDriven拦截器（defaultStack）###

这个拦截器被视为是工作流拦截器是因为，它通过调用闭 `getModel()` 方法改变执行的工作流，并且将模型对象放在ValueStack上从请求接收参数。这改变了工作流，因为在不使用这个拦截器的情况下，参数会被params拦截器直接转移到动作对象上。

## 其他拦截器 ##

### exception拦截器（defaultStack）###

这个拦截器在defaultStack中的顶端，这样可以保证它能够捕获动作调用所有阶段可能生成的所有异常（最后一个触发）。

这个拦截器在捕获异常后将控制转交给结果之前，会创建一个ExceptionHolder对象，并且把它放在ValueStack的最前端。ExceptionHolder是一个异常的包装器，它把跟踪栈和异常作为JavaBean属性公开出来。

###token拦截器和token-session拦截器###

token和token-session拦截器可以作为避免表单重复提交系统的一部分。

### scoped-modelDriven拦截器（defaultStack）###

这个拦截器为工作的模型对象提供跨请求的向导式的持久性。

### execAndWait拦截器 ###

这个拦截器提供了当一个请求需要执行很长时间时，给用户一些反馈。
