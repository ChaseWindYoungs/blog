---
title: 模块规范(CommonJS,AMD,CMD,UMD,ES Module)
---

# 模块规范(CJS,AMD,CMD,UMD,ESM)

## 前言
  前端是个不断发展的技术，从以前的三板斧HTML、CSS、JavaScript，逐渐日益壮大到各种框架百花齐放，各种工具层出不穷，但是项目文件关系之间依旧很割裂，各种依赖只能靠开发人员手动维护顺序来保证各种模块之间的依赖顺序，比如JQuery 和其他依赖于JQuery的库，无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。

## 发展历史
  在模块化标准还没有诞生的时候，前端模块化的雏形有三种形式：

  - 文件划分
  - 命名空间
  - IIFE 私有作用域
  - IIFE参数作为依赖声明使用

  #### 文件划分
  这是最早的模块化实现，简单来说就是把应用的状态和逻辑放到不同的 JS 文件中，HTML 中通过不同的 script 标签一一引入。这样的缺点是：

  - 模块变量相当于在全局声明和定义，会有变量名冲突的问题。
  - 变量都在全局定义，导致难以调试，我们很难知道某个变量到底属于哪些模块。
  - 无法清晰地管理模块之间的依赖关系和加载顺序。
    - 假如 a.js 依赖 b.js，那么 HTML 中的 script 执行顺序需要手动调整，不然可能会产生运行时错误。
  
  #### 命名空间
  命名空间的出现解决了文件划分带来的部分问题，每个变量都有自己专属的命名空间，可以清楚地知道某个变量到底属于哪个模块，同时也避免全局变量命名的问题。

  ```js
    // module-a.js
    window.moduleA = {
      data: "moduleA",
      method: function () {
        console.log("A's module");
      },
    };

    // module-b.js
    window.moduleB = {
      data: "moduleB",
      method: function () {
        console.log("B's module");
      },
    };
  ```
  
  #### IIFE
  IIFE（Immediately Invoked Function Expression）
  [立即执行函数](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)


  每个IIFE都会创建一个私有的作用域，也就是闭包。在私有作用域中的变量外界是无法访问的，只有模块内部的方法才能访问。相比于命名空间的模块化手段，IIFE实现的模块化安全性要更高，对于模块作用域的区分更加彻底，

  具体做法，就是将每个模块成员都放在一个函数提供的私有作用域中，对于需要暴露给外部的成员，通过挂到全局对象（window）上的方式实现：

  ```js
    // module-a.js
    (function () {
      var data = "moduleA";

      function method() {
        console.log(data + "moduleA");
      }

      window.moduleA = {
        method: method,
      };
    })();

    // module-b.js
    (function () {
      var data = "moduleB";

      function method() {
        console.log(data + "moduleB");
      }

      window.moduleB = {
        method: method,
      };
    })();
  ```
  对于其中的`data`变量，我们只能在模块内部的method函数中通过闭包访问，而在其它模块中无法直接访问。这就是模块私有功能功能，避免模块私有成员被其他模块非法篡改，相比于命名空间的实现方式更加安全。
  
  然而命名空间和 IIFE 都没有解决另一个问题──模块加载。如果模块间存在依赖关系，那么 script 标签的加载顺序就需要受到严格的控制，一旦顺序不对，则很有可能产生运行时 Bug。

  #### IIFE参数作为依赖声明使用
  在IIFE的基础上，利用立即执行函数的参数传递模块依赖项，每个模块之间的关系会更加明显。

  例如，在模块中要使用到 jQuery，就可以通过在自执行函数接收一个 $ 的参数，在立即调用时，传递 jQuery 参数。这样的话，在后期维护这个模块时，就可以很清楚的知道，这个模块需要依赖 jQuery。
s


  ## 模块规范的出现
  以上的方式，都是以原始的模块系统为基础，通过约定的方式实现模块化的代码组织。这些方式在不同的开发者去实施的时候，可能会有细微的差别。为了统一不同的开发者，和不同项目之间的差异，我们需要一个标准去规范模块化的实现方式。
  
  在模块化当中，针对于模块加载的问题，在上面几种方式中，都是通过 script 标签，手动引入每个用到的模块，这就意味着，模块的加载并不受代码的控制，时间久了之后，维护起来就很麻烦。
  
  试想一下，如果代码中依赖了一个模块，而在 html 中忘记引用这个模块，就会出现问题了。又或者是，在代码中移除了某个模块的引用，又忘记在 html 中删除这个模块的引用，这些都会产生很大的问题。所以需要一些基础的公共代码，通过代码实现自动加载模块。
  
  总的来说，现在需要一个模块化的规范，和一个可以用来自动加载模块的基础库。


  ## CommonJS

  CommonJS是 Node.js 中提出的一套标准，在 Node.js 中，所有的模块代码必须遵循 CommonJS 规范。它有以下特点：

  - 每个文件就是一个模块 - module
  - 有自己的作用域
  - 通过 module.exports 导出模块内成员
  - require 函数载入模块
  - 模块可以多次加载，但是只会在第一次加载时运行一次
  - 模块加载的顺序，按照其在代码中出现的顺序

  #### CJS模块
  - 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件), 并进行组合在一起
  - 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信

  #### CJS作用域
  - 所有代码都运行在模块作用域，不会污染全局作用域。
  - 在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。
  
  #### module.exports
  - module代表当前模块，是一个对象，保存了当前模块的信息。
  - exports 是 module 上的一个属性，保存了当前模块要导出的接口或者变量。
  - exports 是模块内的私有局部变量，它只是指向了 module.exports，所以直接对 exports 赋值是无效的，这样只是让 exports 不再指向module.exports了而已。

  #### require
  - require的功能是：读取并执行一个JavaScript文件，然后返回该模块的exports对象。
  - 读取时如果没有发现指定模块，会报错。
  - 使用 require 加载的某个模块获取到的值就是那个模块使用 exports 导出的值。
  
  #### 加载
  - 第一次加载时，就缓存了运行结果，以后再加载，就直接读取缓存结果。
  - 要想让模块再次运行，必须清除缓存。
  - **CommonJS 模块的加载机制是，require 的是被导出的值的拷贝。也就是说，一旦导出一个值，模块内部的变化就影响不到这个值**

  ### 实现

  ```js
    // A.js
    var name = 'moduleA'
    var age = 22
    exports.name = name
    exports.getAge = function () {
      return age
    }

    // B.js
    var A = require('A.js')
    console.log('A.name=', A.name)
    console.log('A.age=', A.getAge())
    
    var name = 'B'
    var age = 35
    exports.name = name
    exports.getAge = function () {
      return age
    }

    // index.js
    var B = require('B.js')
    console.log('B.name=', B.name)
  ```

  如果向一个立即执行函数提供 require 、 exports 、 module 三个参数，模块代码放在这个立即执行函数里面。模块的导出值放在 module.exports 中
  
  这样就可以实现模块的加载。
  ```js
    (function(module, exports, require) {
      // b.js
      var a = require("a.js")
      console.log('a.name=', a.name)
      console.log('a.age=', a.getAge())
  
      var name = 'lilei'
      var age = 15
      exports.name = name
      exports.getAge = function () {
        return age
      }
    })(module, module.exports, require)
  ```
  

  ### 弊端

  CommonJS 是以同步模式加载模块的，因为 Node 的执行机制是，在启动时加载模块，执行过程中是不需要加载的，只会使用到模块，所以这种方式在 Node 中不会有问题。
  
  在服务端，模块文件都存在本地磁盘，读取非常快，但是在浏览器端，如果使用 CommonJS 规范的话，因为每次页面加载，都会有大量的同步模式请求出现，就会导致页面效率偏低了。

  ### 
  目前 commonjs 广泛应用于以下几个场景：
  - `Nodejs` 是 CommonJS 在服务器端一个具有代表性的实现；
  - `Browserify` 是 CommonJS 在浏览器中的一种实现；
  - `webpack` 打包工具对 CommonJS 的支持和转换；也就是前端应用也可以在编译之前，尽情使用 CommonJS 进行开发。
  
  



  ## AMD
  `AMD` (Asynchronous Module Definition)，异步模块定义。
  
  AMD由于不是JavaScript原生支持，使用AMD规范进行页面开发需要用到对应的`RequireJS`库函数，实际上AMD是 RequireJS 在推广过程中对模块定义的规范化的产出。

  RequireJS主要解决两个问题
    - 多个js文件可能有依赖关系，被依赖的文件需要早于依赖它的文件加载到浏览器
    - js加载的时候浏览器会停止页面渲染，加载文件越多，页面失去响应时间越长

  AMD规范，制定了定义模块的规则，使得模块之间的依赖可以被异步加载。
  
  AMD的异步，就是所有的模块将被异步加载，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。

  浏览器端模块加载器核心所在是异步的处理，AMD的异步和浏览器的异步加载模块的环境刚好适应（浏览器同步加载模块会导致性能、可用性、调试和跨域访问等问题）。

  AMD规范由CommonJs规范演进而来，大部分思想跟CommonJS类似，属于Modules/Async流派。但AMD规范是专注于浏览器端的，根据浏览器特点做了自己的一些定义实现。

  #### 语法
  requireJS定义了一个函数 define，它是全局变量，用来定义模块

  `define(id?, dependencies?, factory)`;
  - id：可选参数，用来定义模块的标识，如果没有提供该参数，脚本文件名（去掉拓展名）
  - dependencies：是一个当前模块依赖的模块名称数组
  - factory：工厂方法，模块初始化要执行的函数或对象。如果为函数，它应该只被执行一次。如果是对象，此对象应该为模块的输出值 在页面上使用require函数加载模块
  
  require([dependencies], function(){});

  require()函数接受两个参数
  - 第一个参数是一个数组，表示所依赖的模块
  - 第二个参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块
  
  require()函数在加载依赖的函数的时候是异步加载的，这样浏览器不会失去响应，它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。
  

  ## CMD
  `CMD` (Common Module Definition)，通用模块定义

  CMD 是 `Sea.js` 在推广过程中对模块定义的规范化产出。SeaJS要解决的问题和RequireJS一样，只不过在模块定义方式和模块加载（可以说运行、解析）时机上有所不同
  - 一个文件一个模块，所以经常就用文件名作为模块id
  - CMD推崇依赖就近，所以一般不在define的参数中写依赖，在factory中写
  
  #### 语法
  `define(id?, deps?, factory)`
  
  factory是一个函数，有三个参数，function(require, exports, module)
  - require 是一个方法，接受 模块标识 作为唯一参数，用来获取其他模块提供的接口：require(id)
  - exports 是一个对象，用来向外提供模块接口
  - module 是一个对象，上面存储了与当前模块相关联的一些属性和方法
  

  ## UMD
  `UMD` (Universal Module Definition), 统一模块定义
  UMD是一种javascript通用模块定义规范，让你的模块能在javascript所有运行环境中发挥作用，它是AMD和CommonJS的糅合，跨平台的解决方案。
  
  在UMD中，先判断是否支持Node.js的模块（`exports`）是否存在，存在则使用Node.js模块模式。再判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。
  
  #### 特点：
  - 前后端均通用
  - 与`CJS`或`AMD`不同，UMD更像是一种配置多个模块系统的模式。
  - UMD在使用诸如 `Rollup` / `Webpack` 之类的 `bundler` 时通常用作备用模块
  - 扮演过渡机制的角色，执行工厂函数，全局对象挂载属性
  
  ## ES Module

  - 输出/export
  - 输入/import
  - ES Module 静态的，不能放在块级作用域内，代码发生在编译时。
  - ES Module 的值是动态绑定的，可以通过导出方法修改，可以直接访问修改结果。
  - ES Module 可以导出多个属性和方法，可以单个导入导出，混合导入导出。
  - ES Module 模块提前加载并执行模块文件，
  - ES Module 导入模块在严格模式下。
  - ES Module 静态导入导出的特性可以很容易实现 Tree Shaking 和 Code Splitting。
  - ES Module 输入的模块变量是不可重新赋值的，它只是个可读引用，不过却可以改写属性
  - Es Module 还可以 import() 懒加载方式实现代码分割。
  
  ES6的模块不是对象，import命令会被 JavaScript 引擎静态分析，在编译时就引入模块代码，而不是在代码运行时加载，所以无法实现条件加载。也正因为这个，使得静态分析成为可能。

  ## ES Module 模块与 CommonJS 模块的差异

  - CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
    - CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。
    - ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，import加载的值也会跟着变， ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。
  - CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
    - 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
    - 编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。
  
  CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。
  
  ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。
  

  
  ## 参考文档：
  - [前端模块化发展历程](https://zhuanlan.zhihu.com/p/513972915)
  - [CommonJS 不是前端却革命了前端](https://juejin.cn/post/6847902223133835272#heading-11)
  - [前端模块化，AMD与CMD的区别](https://juejin.cn/post/6844903541853650951)
  - [可能是最详细的UMD模块入门指南](https://juejin.cn/post/6844903927104667662)
  - [前端模块化：CommonJS,AMD,CMD,ES6](https://juejin.cn/post/6844903576309858318)