# jQuery 源码学习笔记(1) #

## .data() ##

* 函数说明：
	在指定的所有相关元素中保存任意的数据。
	在指定的所有相关元素的第一个元素中，返回指定的值或者所有值。
* [API文档](http://api.jquery.com/data/)


    data: function( key, value ) {
		var i, name, data,
			elem = this[0],
			attrs = elem && elem.attributes;

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// 在不指定key的情况下，获取当前所有数据
		if ( key === undefined ) {
			if ( this.length ) {
				// 在指定的所有相关元素的第一个元素中，返回所有数据
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// 传入的参数是一个对象时，将该对象的所有属性附加到当前操作的对象上的每一个属性中，
		// 即每一属性都拥有传入对象的所有属性
		// [.each()源码说明](#)
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		
		return arguments.length > 1 ? //防止出现undefined异常

			// 传入的参数为键/值的情况下，将该键/值附加到当前操作对象上的每一个属性中，
			// 即每个属性都拥有传入的键/值
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : undefined;
	}	

在上面源码中，`.data( key, value )`（添加单个属性）和`.data( obj )`（添加多个属性）都使用了`jQuery.data()`方法，接下来我们来看看`jQuery.data()`。

## jQuery.data() ##

	//在jQuery.extend中添加的属性，在JQuery这个实例中可以进行访问
	jQuery.extend({
		......
		data: function( elem, name, data ) {
			return internalData( elem, name, data );
		},
		......
	});

可以看到`jQuery.data()`方法调用了`internalData()`方法，往下走去看看`internalData()`。

## internalData() ## 

	function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}
	
		var ret, thisCache,
			// 为每一个被添加属性的对象添加属性interkey
			internalKey = jQuery.expando,
	
			// 由于在IE6-7中，垃圾回收器无法回收跨越DOM-JS边界的对象引用（IE的BOM和DOM中的对象是使用C++以COM对象的形式实现的），这里需要区分是DOM对象还是JS对象
			isNode = elem.nodeType,
	
			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			// 附加的所有属性会包含在一个对象中，姑且称为对象A，
			// 对于DOM对象，全局对象JQuery.cache中的某个属性的data属性指向这个对象A，
			// 这个属性的确立依赖于DOM对象中的internalkey的值。
			// 对于JS对象，JS对象中的internalkey属性的data属性指向这个对象A。
			cache = isNode ? jQuery.cache : elem,
	
			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
	
		// 避免做一些不需要的工作当调用方尝试通过key获取存放在全局缓存某个属性的数据，
		// 但这个属性并没有存放任何数据。
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && 
		typeof name === "string" ) {
			return;
		}
	
		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			// 对于DOM元素，由于他们的数据是保存在全局缓存对象中，需要分配唯一的ID。
			if ( isNode ) {
				id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}
	
		if ( !cache[ id ] ) {
			// Avoid exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
		}
	
		// 对于传入的参数为对象而不是键/值的情况下，将该对象浅拷贝到缓存对象中
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}
	
		thisCache = cache[ id ];
	
		// jQuery data() 将数据保存在一个单独的对象的内部缓存data中，
		// 这是为了避免对象中的属性和用户自定义的属性发生冲突
		// 这里不明白的是，什么情况下会发生冲突
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}
	
			thisCache = thisCache.data;
		}
	
		// 传入的参数为键/值的情况下
		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}
	
		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( typeof name === "string" ) {
			// 对于传入的参数为键/值的情况下，返回键值
			// First Try to find as-is property data
			ret = thisCache[ name ];
	
			// Test for null|undefined property data
			if ( ret == null ) {
	
				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			// 对于传入的参数为对象的情况，返回对象
			ret = thisCache;
		}
	
		return ret;
	}

对于传入的参数为对象而不是值/键的情况下，即`.data( obj )`（添加多个属性），调用了`jQuery.extend（）`。

## jQuery.acceptData() ##

	/**
	 * 判断一个对象是否能够存放数据
	 */
	jQuery.acceptData = function( elem ) {
		// 全局jQuery对象有一个属性nodata，该属性存放了一个列表，
		// 这个列表是一些键/值，键表示某个对象的名称，值的范围是true/false，
		// 这些键/值构成了某个对象是否能够存放数据的判断依据。
		var noData = jQuery.noData[ (elem.nodeName + " ").toLowerCase() ],
			//elm.nodeType存在负数？
			nodeType = +elem.nodeType || 1;
	
		// Do not set data on non-element DOM nodes because it will not be cleared (#8335).
		return nodeType !== 1 && nodeType !== 9 ?
			false :
	
			// Nodes accept data unless otherwise specified; rejection can be conditional
			!noData || noData !== true && elem.getAttribute("classid") === noData;
	};

## 小结 ##

被附加属性的对象是DOM元素情况下，jQuery会将附加的属性封装成一个对象，并将其保存在全局缓存对象中的某个属性值中，DOM元素有一个名为internalKey的属性指向该对象。