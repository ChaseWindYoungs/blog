---
title: 继承-JS多方式实现
---

# 继承 — JS 实现继承的几种方式 (1)

- 参考文章
  - [JS 原型链与继承别再被问倒了 - 掘金](https://juejin.cn/post/6844903475021627400#heading-9)
  - [JS 继承 原型链继承、构造函数继承、组合继承、原型继承、寄生式继承、寄生组合继承 - 掘金](https://juejin.cn/post/6914216540468576263#heading-5)
  - [面试官问：能否模拟实现 JS 的 new 操作符 - 掘金](https://juejin.cn/post/6844903704663949325)

实现继承，就要有父类：

```jsx
// 定义一个父类
function Father(name) {
  // 属性
  this.name = name || "Father";
  this.isShow = true;
  // 对象属性
  this.info = {
    type: "父亲",
    level: "1",
  };
  // 实例方法
  this.sayName = function () {
    console.log(this.name + "--父类构造函数方法");
  };
}

// 原型方法
Father.prototype.SayAny = function (any) {
  console.log(this.name + "--正在说：" + any);
};

Father.prototype.getInfo = function () {
  console.log(this.info);
  console.log(this.isShow); // true
};
```

- **构造函数, 原型, 实例的关系**

  ::: warning
  每一个构造函数 Father ，存在 原型对象 Father.prototype ，原型对象都包含了一个指向构造函数的指针 Father.prototype.constructor，而实例 instance 都包含了一个指向原型对象的指针 instance.**proto** === Father.prototype
  :::

  例子：

  ```jsx
  const instance = new Father();
  instance.prototype; // undefined
  instance.__proto__; // {SayAny: ƒ, constructor: ƒ} ==> { SayAny: ƒ (any), constructor: ƒ Father(name), [[Prototype]]: Object}
  Father.prototype; // {SayAny: ƒ, constructor: ƒ} ==> { SayAny: ƒ (any), constructor: ƒ Father(name), [[Prototype]]: Object}
  instance.__proto__ === Father.prototype; // true
  Father.prototype.constructor; // function Father (name)
  Father.prototype.constructor === Father; // true
  ```

- **游戏规则**
  ::: warning
  如果试图引用对象(实例 instance)的某个属性，会首先在对象内部寻找该属性，直至找不到，然后才在该对象的原型(instance.prototype)里去找这个属性
  :::
  例子：

  ```jsx

  // 1、创建 instance 实例在 Father的原型对象修改之 **后**
  	function FatherB(type) {
  		this.type = type
  	}
  	const instance2 = new FatherB('LaoWang')
  	Father.prototype = instance2
  	const instance = new Father()
  	instance.name // Father
  	instance.info // {type: '父亲', level: '1'}
  	instance.type // LaoWang
  	instance.__proto__ // FatherB {type: 'LaoWang'} ==> { type: "LaoWang", [[Prototype]]: Object}

  1). 首先会在instance内部属性中找一遍;
  2). 接着会在instance.__proto__(Father.prototype)中找一遍,而Father.prototype 实际上是instance2, 也就是说在instance2中寻找该属性(type);
  3). 如果instance2中还是没有,此时程序不会灰心,它会继续在instance2.__proto__(FatherB.prototype)中寻找...直至Object的原型对象

  // 2、创建 instance 实例在 Father的原型对象修改之 **前**
  	instance.name // Father
  	instance.info // {type: '父亲', level: '1'}
  	instance.type // undefined
  	instance.__proto__ // {SayAny: ƒ, constructor: ƒ} ==> { SayAny: ƒ (any), constructor: ƒ Father(name), [[Prototype]]: Object}

  1). 首先会在instance内部属性中找一遍;
  2). 接着会在instance.__proto__(Father.prototype)中找一遍
  3） Father.prototype 虽然被改为 instance2， 但是实例的创建在原型对象的修改之前，因此作用域没有被修改, 所以（type）为 undefined
  ```

- **1、原型链继承**

  > 将父类的实例作为子类的原型

  例子

  ```jsx
  function Child() {}
  Child.prototype = new Father(); // 改变了第二个类的原型对象

  let instance1 = new Child();
  instance1.info.gender = "男";
  instance1.getInfo(); // {type: "父亲", level: 1, gender: "男"}

  let instance2 = new Child();
  instance2.getInfo(); // {type: "父亲", level: 1, gender: "男"}
  instance2.isShow = false;

  console.log(instance2.isShow); // false
  console.log(instance2.isShow); // true
  ```

  在这里，因为构造函数的原型对象被修改了，所以可以访问到不在原先构造函数上的方法和属性
  但是正因为如此，所以在通过原型链的访问，修改了原型对象上的 引用属性(info) 的值，全局的实例都会被修改

  优点：

  1. 父类方法可以复用

  缺点：

  2. 父类的所有`引用属性`（info）会被所有子类共享，更改一个子类的引用属性，其他子类也会受影响
  3. 子类型实例不能给父类型构造函数传参

- **2、借用构造函数**

  > 在子类构造函数中调用父类构造函数，可以在子类构造函数中使用 `call()` 和 `apply()` 方法

  例子：

  ```jsx
  function Child(name) {
    Father.call(this, name);

    //添加实例自己的属性
    this.age = 18;
  }

  let instance1 = new Child("娃娃1");
  instance1.info.gender = "男";
  console.log(instance1.info); // {type: "父亲", level: 1, gender: "男"}
  console.log(instance1.name); // 娃娃1
  console.log(instance1.age); // 18

  let instance2 = new Child("娃娃2");
  console.log(instance2.info); // {type: "父亲", level: 1}
  console.log(instance2.name); // 娃娃2
  console.log(instance2.age); // 18

  instance1.SayAny; // undefined
  ```

  使用 call() 或 apply() 方法，Father 构造函数在为 Child 的实例创建的新对象的上下文执行了，

  就相当于新的 Child 实例对象上运行了 Father() 函数中的所有初始化代码，结果就是每个实例都有自己的 info 属性。

  相比于原型链继承，借用构造函数的一个优点在于可以在子类构造函数中像父类构造函数传递参数。

  为确保 Father 构造函数不会覆盖 Child 定义的属性，可以在调用父类构造函数之后再给子类实例添加额外的属性

  优点：

  1. 可以在子类构造函数中向父类传参数
  2. 父类的引用属性不会被共享

  缺点：

  1. 子类不能访问父类原型上定义的方法（即不能访问 Father.prototype 上定义的方法），因此所有方法属性都写在构造函数中，每次创建实例都会初始化

- **3、组合继承**

  > 组合继承综合了 `原型链继承` 和 `构造借用函数继承(构造函数继承)`，将两者的优点结合了起来，

  > 基本的思路就是使用原型链继承原型上的属性和方法，而通过构造函数继承实例属性，这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性

  例子：

  ```jsx
  function Child(name, age) {
    // 继承父类属性
    Father.call(this, name);
    this.age = age;
  }

  // 继承父类方法
  Child.prototype = new Father();

  Child.prototype.sayAge = function () {
    console.log(this.age);
  };

  let instance1 = new Child("娃娃1", 19);
  instance1.info.level = "1-1";
  console.log(instance1.info); // {type: '父亲', level: '1-1'}
  instance1.sayAge(); // 19
  instance1.sayName(); // "娃娃1--父类构造函数方法"
  instance1.SayAny("呵呵"); // "娃娃1--正在说：呵呵"

  let instance2 = new Child("娃娃2", 30);
  instance2.info.level = "1-2";
  console.log(instance2.info); // {type: '父亲', level: '1-2'}
  instance2.sayAge(); // 30
  instance2.sayName(); // "娃娃2--父类构造函数方法"
  instance2.SayAny("哈哈"); // "娃娃1--正在说：哈哈"
  ```

  优点：

  1. 父类的方法可以复用
  2. 可以在 Child 构造函数中向 Parent 构造函数中传参
  3. 父类构造函数中的引用属性不会被共享

  缺点：

  组合继承其实调用了两次父类构造函数, 造成了不必要的消耗

- **4、原型式继承**

  > 借助原型可以基于已有的对象创建新的对象，同时还不必因此创建自定义类型

  例子

  ```jsx
  function objectCopy(o) {
    function Fun() {}
    Fun.prototype = o;
    return new Fun();
  }

  let person = {
    name: "yhd",
    age: 18,
    friends: ["jack", "tom", "rose"],
    sayName: function () {
      console.log(this.name);
    },
  };

  let person1 = objectCopy(person);
  person1.name = "wxb";
  person1.friends.push("lily");
  person1.sayName(); // wxb

  let person2 = objectCopy(person);
  person2.name = "gsr";
  person2.friends.push("kobe");
  person2.sayName(); // "gsr"

  console.log(person.friends); // ["jack", "tom", "rose", "lily", "kobe"]
  ```

  **在**objectCopy**()函数内部, 先创建一个临时性的构造函数, 然后将传入的对象作为这个构造函数的原型,最后返回了这个临时类型的一个新实例**

  从本质上讲, object() 返回了一个引用传入对象的新对象. 这样可能带来一些共享数据的问题

  **object.create()**

  接收两个参数:

  - 一个用作新对象原型的对象
  - (可选的)一个为新对象定义额外属性的对象

  object.create() 只有一个参数时功能与上述 objectCopy 方法相同

  ```jsx
  var person = {
    friends: ["Van", "Louis", "Nick"],
  };
  var anotherPerson = Object.create(person);
  anotherPerson.friends.push("Rob");

  var yetAnotherPerson = Object.create(person);
  yetAnotherPerson.friends.push("Style");

  alert(person.friends); //"Van,Louis,Nick,Rob,Style"
  ```

  它的第二个参数与 Object.defineProperties()方法的第二个参数格式相同，

  每个属性都是通过自己的描述符定义的，以这种方式指定的任何属性都会覆盖原型对象上的同名属性

  ```jsx
  var person = {
    name: "Van",
  };
  var anotherPerson = Object.create(person, {
    name: {
      value: "Louis",
    },
  });
  alert(anotherPerson.name); //"Louis"
  ```

  优点：

  1. 父类方法可复用

  缺点：

  1. 父类的引用会被所有子类所共享子类实例不能向父类传参

- **5、寄生继承**

  寄生式继承是与原型式继承紧密相关的一种思路

  > 寄生式继承的思路与(寄生)构造函数和工厂模式类似, 即创建一个仅用于封装继承过程的函数,该函数在内部以某种方式来增强对象,最后再像真的是它做了所有工作一样返回对象.

  例子

  ```jsx
  function objectCopy(o) {
    function Fun() {}
    Fun.prototype = o;
    return new Fun();
  }

  function createAnother(original) {
    var clone = objectCopy(original); //通过调用 objectCopy 函数创建一个新对象
    clone.getName = function () {
      // 以某种方式来增强这个对象
      console.log(this.name);
    };
    return clone; // 返回这个对象
  }

  let person = {
    name: "yhd",
    friends: ["rose", "tom", "jack"],
  };

  let person1 = createAnother(person);
  person1.friends.push("lily");
  person1.getName(); // yhd
  console.log(person1.friends);

  let person2 = createAnother(person);
  console.log(person2.friends); // ["rose", "tom", "jack", "lily"]
  ```

  使用寄生式继承来为对象添加函数, 会由于不能做到函数复用而降低效率;这一点与构造函数模式类似

- **6、寄生式组合继承**

  组合继承是 JavaScript 最常用的继承模式，不过, 它也有自己的不足

  组合继承最大的问题就是无论什么情况下,都会调用两次父类构造函数: 一次是在创建子类型原型的时候, 另一次是在子类型构造函数内部

  > **寄生组合式继承就是为了降低调用父类构造函数的开销而出现的，基本思路是: 不必为了指定子类型的原型而调用超类型的构造函数**

- **new 做了什么**

  1. 创建了一个全新的对象。
  2. 这个对象会被执行`[[Prototype]]`（也就是`__proto__`）链接。
  3. 生成的新对象会绑定到函数调用的`this`。
  4. 通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
  5. 如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。\*\*\*\*

  ```jsx
  /**
   * 模拟实现 new 操作符
   * @param  {Function} ctor [构造函数]
   * @return {Object|Function|Regex|Date|Error}      [返回结果]
   */
  function newOperator(ctor) {
    if (typeof ctor !== "function") {
      throw "newOperator function the first param must be a function";
    }

    // ES6 new.target 是指向构造函数
    // new.target属性允许你检测函数或构造方法是否是通过new运算符被调用的。
    // 在通过new运算符被初始化的函数或构造方法中，new.target返回一个指向构造方法或函数的引用。
    // 在普通的函数调用中，new.target 的值是undefined。
    newOperator.target = ctor;

    // 1.创建一个全新的对象，
    // 2.并且执行[[Prototype]]链接
    // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
    // Object.create(obj) = functiong(obj) { function F() {}; F.prototype = obj; return new F() }
    var newObj = Object.create(ctor.prototype);

    // ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
    // 除去ctor构造函数的其余参数
    // slice 方法可以用来将一个类数组（Array-like）对象/集合转换成一个新数组。你只需将该方法绑定到这个对象上。 一个函数中的  arguments 就是一个类数组对象的例子。
    // 除了使用 Array.prototype.slice.call(arguments)，你也可以简单的使用 [].slice.call(arguments) 来代替。另外，可以使用 bind 来简化该过程。
    var argsArr = [].slice.call(arguments, 1);

    // 3.生成的新对象会绑定到函数调用的`this`。
    // 获取到ctor函数返回结果
    var ctorReturnResult = ctor.apply(newObj, argsArr);

    // 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
    var isObject =
      typeof ctorReturnResult === "object" && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === "function";
    if (isObject || isFunction) {
      return ctorReturnResult;
    }

    // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
    return newObj;
  }
  ```
