---
layout: default
tags: js
title: 跨浏览器问题集锦
---

#跨浏览器问题集锦#

1. IE浏览器下，对 `<table>`、`<tbody>` 和 `<tr>` 等标签的 `innerHTML` 属性进行写操作时会报错，会出现“未知的运行错误”。
2. 在IE7以及以前版本中， `setAttribute()` 存在一些异常行为。通过这个方法设置class和style特性，没有任何效果，而使用这个方法设置事件处理程序特性时也一样，尽管IE8已经解决了这些问题，但我们仍然不建议使用该方法设置特性。
3. IE6及以前版本不支持 `removeAttribute()`