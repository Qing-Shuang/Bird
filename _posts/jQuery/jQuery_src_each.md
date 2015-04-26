# jQuery 源码学习笔记(2)--.each() #

## .each() ##

* 函数说明：
	遍历JQuery实例中每一个属性，并为每个属性执行某个方法。
* [API文档](http://api.jquery.com/each/)


	//在JQuery原型中添加的属性，每一个JQuery实例都会拥有该属性
	jQuery.fn = jQuery.prototype = {
		......
		
		// 遍历JQuery实例中每一个属性，并为每个属性执行某个方法
		// 该方法由调用方指定，我们称为“回调函数”
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function( callback, args ) {
			return jQuery.each( this, callback, args );
		},
		
		......
	}

## jQuery.each() ##

	//在jQuery.extend中添加的属性，在jQuery这个实例中可以进行访问
	jQuery.extend({
		......
		// args is for internal usage only
		each: function( obj, callback, args ) {
			var value,
				i = 0,
				length = obj.length,
				isArray = isArraylike( obj );
	
			if ( args ) {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						// 在每个属性的作用域上执行某个方法,下面亦同 
						// 这里使用了apply方法确保了回调函数运行在正确的作用域，
						// 如果不使用apply方法，回调函数将运行在全局windows的作用域中·:
						value = callback.apply( obj[ i ], args );
	
						// 执行失败则退出
						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.apply( obj[ i ], args );
	
						if ( value === false ) {
							break;
						}
					}
				}
	
			// A special, fast, case for the most common use of each
			} else {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.call( obj[ i ], i, obj[ i ] );
	
						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.call( obj[ i ], i, obj[ i ] );
	
						if ( value === false ) {
							break;
						}
					}
				}
			}
	
			return obj;
		},
		......
	});