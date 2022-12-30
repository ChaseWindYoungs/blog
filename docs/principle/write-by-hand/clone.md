# 浅拷贝与深拷贝


## **浅拷贝**

**1.Object.assign()**

Object.assign() 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。

## 深拷贝

### **1.JSON.parse(JSON.stringify())**

```jsx
// JSON.parse(JSON.stringify())
let arr = [
	1,3,{
		username:'Sirius'
	}
]

let arr4 = JSON.parse(JSON.stringify(arr));
arr4.usrename = 'Michale';
console.log(arr, arr4)

结果是两个参数是不一样的
```

利用JSON.stringify() 将对象转成 JSON 字符串，再用JSON.parse，把字符串解析成对象，新的对象就会产生了，而且新的对象会开辟新的栈，实现了深拷贝

**这种方法虽然可以实现数组或者对象的深拷贝，但是不能处理函数和正则**，因为这两者基于JSON的方法处理后，得到的正则就不再是正则，会变为空对象，得到的函数就不是函数，而是null

比如：

```jsx
let arr = [
	1,3, {
		username: 'Sirius'
	},
	function() {
		console.log(111)
	}
]

let arr4 = JSON.parse(JSON.stringify(arr))
arr4[2].username= 'Michale';
console.log(arr, arr4)

结果是，虽然username 是变了，但是function 却变成了 null

```

## 2、手写

简单的思路，可以用递归来解决问题

- 如果是原始类型，无需继续拷贝，直接返回
- 如果是引用类型，创建一个新的对象，遍历需要克隆的对象，将需要克隆对象的属性执行**深拷贝后**依次添加到新对象上
- 1）最简单的深拷贝 — 考虑了普通的object
    
    ```jsx
    function clone(target) {
    	if(typeof target === 'object') {
    		let cloneTarget = {};
    		for(const key in target) {
    			cloneTarget[key] = clone(target[key])
    		}
    		return cloneTarget
    	} else {
    		return target	
    	}
    }
    
    例子：
     const target = {
        field1: 1,
        field2: undefined,
        field3: 'ConardLi',
        field4: {
            child: 'child',
            child2: {
                child2: 'child2'
            }
        }
    };
    ```
    
- 2) 兼容数组
    
    ```jsx
    function clone(target) {
    	if(typeof target === 'object) {
    		let cloneTarget = Array.isArray(target)? []: {};
    		for(const key in target) {
    			cloneTarget[key] = clone(target[key])
    		}
    		return cloneTarget;
    	} else {
    		return target;	
    	}
    }
    
    例子： 
    const target = {
        field1: 1,
        field2: undefined,
        field3: {
            child: 'child'
        },
        field4: [2, 4, 8]
    };
    ```
    
- 3）循环引用
    
    对象的属性间接或直接的引用了自身的情况；
    
    如何解决：
    
    可以额外开辟一个新的存储空间，来存储当前对象和拷贝对象之间的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话没继续拷贝，
    
    这个存储空间，需要可以存储 key-value 形式的数据，而且key 可以是一个引用类型，可以选择map这种数据结构
    
    - 检查map中有无克隆过的对象
    - 有，直接返回，
    - 没有，将当前对象作为key，克隆对象作为value进行存储
    - 继续克隆
    
    ```jsx
    function clone(target, map = new Map()) {
    	if(typeof target === 'object') {
    		let cloneTarget = Array.isArray(target) ? [] : {}
    		if(map.get(target)) {
    			return map.get(target)
    		}
    		map.set(target, cloneTarget);
    		for(const key in target) {
    			cloneTarget[key] = clone(target[key], map);
    		}
    		return cloneTarget;
    	} else {
    		return target;
    	}
    }
    ```
    
    利用 WeakMap 代替 Map
    
    ```jsx
    function clone(target, map = new WeakMap()) {
    	if(typeof target === 'object') {
    		let cloneTarget = Array.isArray(target) ? [] : {}
    		if(map.get(target)) {
    			return map.get(target)
    		}
    		map.set(target, cloneTarget);
    		for(const key in target) {
    			cloneTarget[key] = clone(target[key], map);
    		}
    		return cloneTarget;
    	} else {
    		return target;
    	}
    }
    ```
    
    WeakMap的作用
    
    > WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
    > 
    
    弱引用
    
    > 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。
    > 
    
    默认创建一个对象：`const obj = {}`，就默认创建了一个强引用的对象，我们只有手动将`obj = null`，它才会被垃圾回收机制进行回收，如果是弱引用对象，垃圾回收机制会自动帮我们回收。
    
    ```jsx
    let obj = { name : 'ConardLi'}
    const target = new Map();
    target.set(obj,'code秘密花园');
    obj = null;
    
    虽然我们手动将obj，进行释放，然是target依然对obj存在强引用关系，
    所以这部分内存依然无法被释放。
    
    let obj = { name : 'ConardLi'}
    const target = new WeakMap();
    target.set(obj,'code秘密花园');
    obj = null;
    
    如果是WeakMap的话，target和obj存在的就是弱引用关系，
    当下一次垃圾回收机制执行时，这块内存就会被释放掉。
    
    ```
    
    如果是`WeakMap`的话，`target`和`obj`存在的就是弱引用关系，当下一次垃圾回收机制执行时，这块内存就会被释放掉。如果我们要拷贝的对象非常庞大时，使用`Map`
    会对内存造成非常大的额外消耗，而且我们需要手动清除`Map`的属性才能释放这块内存，而`WeakMap`会帮我们巧妙化解这个问题。
    
- 4）其他数据类型
    
    合理的判断引用类型
    
    ```jsx
    判断是否为引用类型，
    还需要考虑function和null两种特殊的数据类型
    function isObject(target) {
        const type = typeof target;
        return target !== null && (type === 'object' || type === 'function');
    }
    ```
    
    获取数据类型
    
    ```jsx
    function getType(target) {
        return Object.prototype.toString.call(target);
    }
    
    const mapTag = '[object Map]';
    const setTag = '[object Set]';
    const arrayTag = '[object Array]';
    const objectTag = '[object Object]';
    
    const boolTag = '[object Boolean]';
    const dateTag = '[object Date]';
    const errorTag = '[object Error]';
    const numberTag = '[object Number]';
    const regexpTag = '[object RegExp]';
    const stringTag = '[object String]';
    const symbolTag = '[object Symbol]';
    
    分为两类：
    	可以继续遍历的类型
    	不可以继续遍历的类型
    ```