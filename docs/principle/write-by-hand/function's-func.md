---
title: call、apply、bind
---
# 分析 call、apply、bind，并手写

- **分析**
    
    - **前提：**
    
    1. this 永远指向最后调用它的那个对象
    2. 箭头函数的 this 始终指向函数定义时的 this，而非执行时
    3. 箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，
    4. 如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined
    
    - **语法：**
    
      ```jsx
      fun.call(thisArg, param1, param2, ...)
      fun.apply(thisArg, [param1, param2,...])
      fun.bind(thisArg, param1, param2, ...)
      ```
    
    - **返回值：**
    
      call/apply：`fun`执行的结果 bind：返回`fun`的拷贝，并拥有指定的`this`值和初始参数
    
    - **参数：**
    
      `thisArg`(可选):
      1. **`fun`的`this`指向`thisArg`对象**
      2. 非严格模式下：thisArg指定为null，undefined，fun中的this指向window对象.
      3. 严格模式下：`fun`的`this`为`undefined`
      4. 值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象，如 String、Number、Boolean
    
      `param1,param2`(可选): 传给`fun`的参数。
      
      5. 如果param不传或为 null/undefined，则表示不需要传入任何参数.
      6. apply第二个参数为数组，数组内的值为传给`fun`的参数。
    
    - **作用：**
    
      改变函数执行时的 this 指向，目前所有关于它们的运用，都是基于这一点来进行的。
      
      怎么改变 this 的指向，总结有以下几种方法：
      
      1. 使用 ES6 的箭头函数
      2. 在函数内部使用 `_this = this`
      3. 使用 `apply`、`call`、`bind`
      4. `new` 实例化一个对象


- **call**
    
    介绍： call() 方法在使用一个指定的this值 和 若干个指定的参数值的前提下，调用某个方法，🌰：
    
    ```jsx
    const Person = {
    	value:1
    }
    function eat() {
    	console.log(this.value);
    }
    eat.call(Person) // 1
    
    call 改变了this的指向，指向到了 Person
    eat 函数执行了
    ```
    
    - **实现步骤**
        - **1） 基础方法**
            
            试想一下，在调用 call的时候，把Person对象改造成如下
            
            ```jsx
            const Person = {
            	value:1,
            	eat: {
            		console.log(this.value);
            	}
            }
            Person.eat() // 1
            ```
            
            这个时候，this就是指向了Person， 但是这样就给Person对象本身添加了一个属性，所以要用delete 删除
            
            所以我们模拟的步骤可以分为：
            
            1. 将调用call的方法设置为当作参数的对象的属性，
            2. 执行该函数
            3. 删除该函数
            
            ```jsx
            // 第一步
            Person.fn = eat
            // 第二步
            Person.fn()
            // 第三步
            delete Person.fn
            ```
            
        - **2） Mycall第一版**
            
            ```jsx
            Function.prototype.MyCall = function (context) {
            	context.fn = this // 首先应该先把调用call方法的函数保存下来，用this可以获取到调用者
            	context.fn()
            	delete context.fn
            }
            
            // 测试一下
            const Person = {
            	value:1
            }
            function eat() {
            	console.log(this.value);
            }
            eat.MyCall(Person) // 1
            ```
            
        - **3）Mycall第二版**
            1. call支持多个参数，也有可能一个都没
            2. 给上下文定义的方法要唯一，不能是fn
            3. 在多参数的时候，要把参数传递给扩展方法
            4. 调用要是一个函数
            
            （1）如果不传入参数，没有指定this的明确指向，则this指向window
            
            ```jsx
            Function.prototype.MyCall = function (context) {
              context = context || window
            	context.fn = this // 首先应该先把调用call方法的函数保存下来，用this可以获取到调用者
            	context.fn()
            	delete context.fn
            }
            ```
            
            （2）调用MyCall 的方法，在自定义的MyCall中，如果正好和MyCall.fn重名了，需要解决重名问题
            
            可以使用es6的新类型 Symbol，定义一个唯一的值 `fn = Symbol()`
            
            ```jsx
            // 实现 简单的 Symbol()
            function MySymbol(obj) {
            	// slice() 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。
            	let unique = (Math.random() + new Date().getTime().toString(32)).slice(0,8)
            	// 判断在 obj上是否有同名属性， 如果有，继续递归调用，重新生成
            	if(obj.hasOwnProperty(unique)) {
            		return MySymbol(obj)
            	} else {
            		return unique
            	}
            }
            ```
            
            （3）多参数，将第一个参数作为this将要指向的对象，其余的参数则作为调用 MyCall 方法的参数
            
            ```jsx
            function MySymbol(obj) {
            	// slice() 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。
            	let unique = (Math.random() + new Date().getTime().toString(32)).slice(0,8)
            	// 判断在 obj上是否有同名属性， 如果有，继续递归调用，重新生成
            	if(obj.hasOwnProperty(unique)) {
            		return MySymbol(obj)
            	} else {
            		return unique
            	}
            }
            
            Function.prototype.MyCall = function (context) {
            	// 判断调用对象
              if (typeof this !== "function") {
                console.error("type error");
              }
            	context = context || window
            	let fn = MySymbol(context)
            	context[fn] = this
            	//[...xxx]把类数组变成数组，slice返回一个新数组
            	let args = [...arguments].slice(1)
            	const result = context[fn](...args) //将所有参数解构出来，传入到方法中
            	delete context[fn] // 删除方法
            	return result
            } 
            
            // 测试一下
            const Person = {
            	value:1
            }
            function eat() {
            	console.log(this.value);
            }
            eat.MyCall(Person) // 1
            ```
            
        
        理解点：
        
        context 是传入的参数，也可以被称为上下文，
        
    
- **apply**
    
    介绍： **`apply()`** 方法调用一个具有给定`this`值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#working_with_array-like_objects)）的形式提供的参数。
    
    🌰
    
    ```jsx
    const numbers = [5, 6, 2, 3, 7];
    
    const max = Math.max.apply(null, numbers);
    
    console.log(max);
    // expected output: 7
    
    const min = Math.min.apply(null, numbers);
    
    console.log(min);
    // expected output: 2
    ```
    
    实现：
    
    ```jsx
    function MySymbol(obj) {
    	// slice() 方法提取某个字符串的一部分，并返回一个新的字符串，且不会改动原字符串。
    	let unique = (Math.random() + new Date().getTime().toString(32)).slice(0,8)
    	// 判断在 obj上是否有同名属性， 如果有，继续递归调用，重新生成
    	if(obj.hasOwnProperty(unique)) {
    		return MySymbol(obj)
    	} else {
    		return unique
    	}
    }
    
    Function.prototype.MyCall = function (context) {
    	// 判断调用对象
      if (typeof this !== "function") {
        throw new TypeError("Error");
      }
    	context = context || window
    	let fn = MySymbol(context)
    	context[fn] = this
    	let result 
    	if (!arr) {
          result = context.fn();
      } else {
    		const result = context.fn(...arr) 
    	}
    	delete context[fn] // 删除方法
    	return result
    } 
    ```
    
- **bind**
    
    要求：
    
    生成新的函数
    
    传入参数
    
    新函数被调用时候，执行传入的参数（手动指定作用域）
    
    实现：
    
    ```jsx
    Function.prototype.MyBind = function (conetext) {
    	const fn = this, args = [...arguments].slice(1)
    	// 这个this 代表的是当前调用这个方法的对象
    	const binded = function () {
    		// 这里的判断，主要是用于 用 bind生成的函数，是构造函数的时候
    		// 例如 const newFn = fn.bind(null, param)
    		// const instance = new newFn('aaa')
    		// 这个时候，newFn是通过 bind生成的构造函数，instance是newFn的实例，实例的内部的this指向实例
    		if(this instanceof binded){
    			// 这个this，代表的是通过new方法生成的实例
    			fn.apply(this, args.concat([...arguments]))
    		} else {
    			fn.apply(context, args.concat([...arguments]))
    		}
    	}
    	// 还差一个返回构造函数的时候，对调用对象的继承没有实现
    	return binded
    }
    ```
    
    例子🌰
    
    ```jsx
    var obj = {
    	name: 'jack',
    }
    
    function test (name, age) {
    	this.name = name;
    	this.age = age;
    }
    
    // 生成构造函数类型
    const newObj = test.bind(null,'Rose')
    const instance = new newObj(26)
    console.log(instance) // test {name: 'Rose', age: 26}
    
    // 生成普通函数类型
    const test2 = test.bind(obj, 26)
    test2(1995)
    console.log(obj) // {name: 26, age: 1995}
    ```
    
- 各种例子
    1. **类数组（Array-like）对象**
        
        [Array.prototype.slice() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice#array-like)
        
        `slice` 方法可以用来将一个类数组（Array-like）对象/集合转换成一个新数组。你只需将该方法绑定到这个对象上。 一个函数中的  `[arguments](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)` 就是一个类数组对象的例子。
        
        ```jsx
        function list() {
          return Array.prototype.slice.call(arguments);
        }
        
        var list1 = list(1, 2, 3); // [1, 2, 3]
        ```
        
        除了使用 `Array.prototype.slice.call(arguments)`，也可以简单的使用 `[].slice.call(arguments)` 来代替。
        
        另外，可以使用 `bind` 来简化该过程。
        
        ```jsx
        var unboundSlice = Array.prototype.slice;
        var slice = Function.prototype.call.bind(unboundSlice);
        
        function list() {
          return slice(arguments);
        }
        
        var list1 = list(1, 2, 3); // [1, 2, 3]
        ```