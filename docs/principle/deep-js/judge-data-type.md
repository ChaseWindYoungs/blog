# 判断数据类型

****typeof****

typeof null 返回类型错误，返回object

引用类型，除了function返回function类型外，其他均返回object。

其中，null 有属于自己的数据类型 Null ， 引用类型中的 数组、日期、正则 也都有属于自己的具体类型，而 typeof 对于这些类型的处理，只返回了处于其原型链最顶端的 Object 类型，

```jsx
1. 原始值类型
    typeof '';           //'string'
    typeof 1;            //'number'
    typeof true;         //'boolean'
    typeof null;         //'object'
    typeof undefined;    //'undefined'
    typeof Symbol;       //'function'
    typeof Symbol();     //'symbol'
2. 引用数据类型    
    typeof function(){}  //'function'
    typeof Date          //'function'
    typeof RegExp        //'function'
    typeof []            //'object'
    typeof {}            //'object'
```

****instanceof****

**`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

注意： 

如果表达式 `obj instanceof Foo` 返回 `true` ，则并不意味着该表达式会永远返回 `true` ，

因为 `Foo.prototype` 属性的值有可能会改变，改变之后的值很有可能不存在于 `obj` 的原型链上，这时原表达式的值就会成为 `false`。

另外一种情况下，原表达式的值也会改变，就是改变对象 `obj` 的原型链的情况，

虽然在目前的ES规范中，我们只能读取对象的原型而不能改变它，但借助于非标准的 `__proto__` 伪属性，是可以实现的。

比如执行 `obj.__proto__ = {}` 之后，`obj instanceof Foo` 就会返回 `false` 了

在这里需要特别注意的是：**instanceof 检测的是原型**

[] 的原型指向Array.prototype，间接指向Object.prototype, 因此 [] instanceof Array 返回true， [] instanceof Object 也返回true。

instanceof 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型。

原理： 

```jsx
function myInstanceof(leftValue, rightValue) {
	let leftProto = Object.getPrototypeOf(leftValue), // 获取对象的原型
			rightProto = Object.getPrototypeOf(rightValue) // 获取构造函数的 prototype 属性
	// 判断构造函数的prototype 对象
	while(true) {
		if(!leftProto) return false;
		if(leftProto === rightProto) return true;
		// 如果都不符合，将继续去查找左边变量的原型，赋值给左变量的原型
		leftProto = Object.getPrototypeOf(leftProto)
	}
}
```

**toString**

```jsx
Object.prototype.toString.call('') ;   // [object String]

Object.prototype.toString.call(1) ;    // [object Number]

Object.prototype.toString.call(true) ; // [object Boolean]

Object.prototype.toString.call(Symbol()); //[object Symbol]

Object.prototype.toString.call(undefined) ; // [object Undefined]

Object.prototype.toString.call(null) ; // [object Null]

Object.prototype.toString.call(new Function()) ; // [object Function]

Object.prototype.toString.call(new Date()) ; // [object Date]

Object.prototype.toString.call([]) ; // [object Array]

Object.prototype.toString.call(new RegExp()) ; // [object RegExp]

Object.prototype.toString.call(new Error()) ; // [object Error]

Object.prototype.toString.call(document) ; // [object HTMLDocument]

Object.prototype.toString.call(window) ; //[object global] window 是全局对象 global 的引用
```

****总结********

|  数据类型      | 位置 | 其他 |
| ----------- | ----------- |----------- |
| 字符串（String）、数字(Number)、布尔(Boolean)、对空（Null）、未定义（Undefined）、Symbol| 存储在栈中的简单数据段，他们的值直接存储在变量访问的位置。 在内存中占据固定大小，保存在栈内存中。| 原始值是不可更改的：任何方法都无法更改一个原始值 
| 对象(Object)、数组(Array)、函数(Function)、日期（Date）、正则（RegExp）| 存储在堆中的对象，存储在变量处的值是一个指针，指向存储对象的内存处。| 可修改的

