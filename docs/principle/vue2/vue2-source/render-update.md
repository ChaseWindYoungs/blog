---
title: 渲染更新原理
---

Vue 初始渲染原理  完成了  **数据到视图层的映射过程，**但是当我们改变数据的时候发现页面并不会自动更新<br />Vue 的一个特性就是数据驱动 当数据改变的时候 我们无需手动操作 dom 视图会自动更新<br />回顾第一篇 响应式数据原理，此篇主要采用 **观察者模式 定义 Watcher 和 Dep 完成依赖收集和派发更新 从而实现渲染更新**

## watcher 与 dep 的 重点理解：

1. **一个属性可以对应多个watcher，同时一个watcher可以对应多个属性**
2. **每个属性 “分配” 一个dep，dep中存放的就是这个属性对应的观察者watcher，而每个watcher中存放的是多个dep，dep对应的就是属性**
## 1、正文
我们在 setTimeout 里面调用 vm._update(vm._render())来实现更新功能，<br />因为从上一篇初始渲染的原理可知，此方法就是渲染的核心，<br />但是我们不可能每次数据变化都要求用户自己去调用渲染方法更新视图，<br />因此我们 **需要一个机制在数据变动的时候自动去更新**
```javascript
<script>
// Vue实例化
let vm = new Vue({
  el: "#app",
  data() {
    return {
      a: 123,
    };
  },
  // render(h) {
  //   return h('div',{id:'a'},'hello')
  // },
  template: `<div id="a">hello {{a}}</div>`,
});

// 我们在这里模拟更新
setTimeout(() => {
  vm.a = 456;
  // 此方法是刷新视图的核心
  vm._update(vm._render());
}, 1000);
</script>
```


观察者模式：属性是 **被观察者**，刷新页面是 **观察者**
```javascript

export function mountComponent(vm, el) {
  // 更新函数，数据变化后会再次调用此函数
  let updateComponent = () => {
    vm.$el = el;
    vm._update(vm._render());
  }
  // 它是一个渲染watcher，后续有其他的watcher
  updateComponent()
}
```
## 2、定义 Watcher
watcher.js 代表和观察者相关 <br />首先介绍 Vue 里面使用到的[观察者模式](https://www.cnblogs.com/zhengyufeng/p/10985321.html) 我们可以把 Watcher 当做观察者，它需要订阅数据的变动，当数据变动之后，通知它去执行某些方法，<br />Watcher 构造函数 <br />new的对象参数包括 (vm, exprOrFn, cb, options)

- 需要订阅数据的变动，传入vm，
- 数据变动后执行更新函数，传入exprOnFn，
- 更新结束后会执行某些回调函数，传入cb，
- 有些时候需要传入一些其他的参数，传入options
- 初始化Watcher的时候会去执行 get 方法

Watcher关键点：

1. exprOrFn方法做了什么？是vm调用了update方法，参数是render方法的AST，而AST中的变量，是去vm上取的值
2. 因为 **每个属性会被多个watcher监听，会对应多个watcher**，所以watcher为了有个标识，需要给每个watcher加 id，每一次new的时候，都将id改变 id++
3. 在new watcher 的时候会直接调用 get()，this.getter() 中会取得vm上的属性，取属性的时候，会触发 defineProperty.get 属性,
4. 如何将属性与wathcer 的关系进行关联和收集管理，需要另外一个对象 **Dep** 来实现
5. 在调用 this.getter() 前，需要将watcher 与dep 都先结合起来
```javascript
// 全局变量id  每次new Watcher都会自增
let id = 0;
export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb; //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options; //额外的选项 true代表渲染watcher
    this.id = id++; // watcher的唯一标识
    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }
    // 实例化就会默认调用get方法
    this.get();
  }
  // 用户更新时，可以重新调用getter 方法
  get() {
    this.getter();
  }
}
```

## 3、创建渲染 Watcher
在组件挂载方法里面 定义一个渲染 Watcher 主要功能就是执行核心渲染页面的方法
```javascript
// src/lifecycle.js
export function mountComponent(vm, el) {
  //   _update和._render方法都是挂载在Vue原型的方法  类似_init

  // 引入watcher的概念 这里注册一个渲染watcher 执行vm._update(vm._render())方法渲染视图

  let updateComponent = () => {
    console.log("刷新页面");
    vm._update(vm._render());
  };
  new Watcher(vm, updateComponent, null, true);
}

```
## 4、定义 Dep

- dep和watcher是多对多的关系，每个属性都有自己的dep
- dep也有自己的唯一标识
- 在dep中，存放对应的watcher 因此需要一个数组 subs 存放
- dep的指向是根据调用的时候来保存的
```javascript
let id = 0; //dep实例的唯一标识
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 这个是存放watcher的容器
  }
}
// 默认Dep.target为null
Dep.target = null;

```
## 5、对象的依赖收集

- 每个属性上都有dep属性，因此在监听属性的同时，为每个属性实例化一个Dep，用来保存对应关系
- 在数据被访问的时候，通过 dep.depend 方法，将watcher 与 dep关联起来
- 这里的步骤需要去看一下，触发的get 方法之前做了什么，触发前在 watcher 实例中执行了 pushTarget(this)，将当前的watcher 推送到了 dep的 存watcher 的栈中，并且将 Dep.target 指向了当前 watcher
- 在set的时候，可以先判断值的前后是否相同，如果相同，就返回，不相同时执行 dep.notify，通知该属性对应的 dep 的 subs 存储的 watcher， 依次执行subs里面的watcher更新方法
```javascript
class Observer {
 ...
}

function defineReactive(data, key, value) {
  
  observe(value); 
  
  let dep = new Dep() 
  // 根据重点理解2，每个属性上都有dep属性，为每个属性实例化一个Dep
  
  Object.defineProperty(data, key, {
    get() {
      
      // 在通过编译取值时，可以把 watcher 与 dep 对应起来 --依赖收集
      if (Dep.target) {
        // 如果有watcher dep就会保存watcher 同时watcher也会保存dep
        dep.depend();
      }
      
      return value;
    },
    set(newValue) {
      if (newValue === value) return;
      
      // 如果赋值的新值也是一个对象  需要观测
      observe(newValue);
      
      value = newValue;
      
      dep.notify(); // 通知渲染watcher去更新--派发更新
    },
  });
}
```
## 6、完善 watcher
```javascript
// src/observer/watcher.js

import { pushTarget, popTarget } from "./dep";

// 全局变量id  每次new Watcher都会自增
let id = 0;

export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb; //回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options; //额外的选项 true代表渲染watcher
    this.id = id++; // watcher的唯一标识
    this.deps = []; //存放dep的容器
    this.depsId = new Set(); //用来去重dep
    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }
    // 实例化就会默认调用get方法
    this.get();
  }
  get() {
    pushTarget(this); // 在调用方法之前先把当前watcher实例推到全局Dep.target上
    this.getter(); //如果watcher是渲染watcher 那么就相当于执行  vm._update(vm._render()) 这个方法在render函数执行的时候会取值 从而实现依赖收集
    popTarget(); // 在调用方法之后把当前watcher实例从全局Dep.target移除
  }
  // 把dep放到deps里面 同时保证同一个dep只被保存到watcher一次  同样的  同一个watcher也只会保存在dep一次
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      //   直接调用dep的addSub方法  把自己--watcher实例添加到dep的subs容器里面
      dep.addSub(this);
    }
  }
  //   这里简单的就执行以下get方法  之后涉及到计算属性就不一样了
  update() {
    this.get();
  }
}

```
## 7、完善Dep
Dep.target，全局的静态属性，就一份
```javascript
// dep和watcher是多对多的关系
// 每个属性都有自己的dep
let id = 0; //dep实例的唯一标识
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 这个是存放watcher的容器
  }
  depend() {
    //   如果当前存在watcher
    if (Dep.target) {
      // Dep.target 就是在 watcher 中 调用的 pushTarget，存下来的watcher
      // 因此，Dep.target可以调用 addDep 方法，存放 dep(this)
      Dep.target.addDep(this); // 把自身-dep实例存放在watcher里面
    }
  }
  notify() {
    //   依次执行subs里面的watcher更新方法
    this.subs.forEach((watcher) => watcher.update());
  }
  addSub(watcher) {
    //   把watcher加入到自身的subs容器
    this.subs.push(watcher);
  }
}
// 默认Dep.target为null
Dep.target = null;
// 栈结构用来存watcher
const targetStack = [];

export function pushTarget(watcher) {
  targetStack.push(watcher);
  Dep.target = watcher; // Dep.target指向当前watcher
}
export function popTarget() {
  targetStack.pop(); // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1];
}

```
## 8、总结

1. **重点理解**
2. addDep 与 addSub 是双向的
   - addDep 是 watcher 中存放 对应的deps 的，存之前会去重，并且在addDep中直接调用 addSub
   - addSub是 dep 中存放对应的watcher 的，因为在watcher中存放dep之前已经去重过，所以addSub存的是已经去重过的watcher，不会重复

