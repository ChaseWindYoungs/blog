---
title: Vue响应式原理
---
# Vue响应式原理(Object.defineProperty)全过程解析

### Vue 如何动态的更新

<aside>
💡 Vue 的响应式原理是通过 Object.defineProperty 实现的。被 Object.defineProperty 绑定过的对象，会变成「响应式」化。也就是改变这个对象的时候会触发 get 和 set 事件。进而触发一些视图更新。其中最重要的几个点包括 Observer， defineReactive， Dep， Watcher

</aside>

### Observer「响应式」

 

 循环修改为每个属性添加 get set

```jsx
const Observer = function (data) {
// 循环修改为每个属性添加get setfor (let key in data) {
    defineReactive(data, key);
  }
};
```

Object.defineProperty: 实现代理对象的方法，并且将对象的改变推送到调度中心 Dep 中

举个例子 🌰：

```jsx
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      console.log("我被读了，我要不要做点什么好?");
      return val;
    },
    set: (newVal) => {
      if (val === newVal) {
        return;
      }
      val = newVal;
      console.log("数据被改变了，我要把新的值渲染到页面上去!");
    },
  });
}

let data = {
  text: "hello world",
};

// 对data上的text属性进行绑定
defineReactive(data, "text", data.text);

console.log(data.text);// 控制台输出 <我被读了，我要不要做点什么好?>
data.text = "hello Vue";// 控制台输出 <hello Vue && 数据被改变了，我要把新的值渲染到页面上去!>
```

### Dep 「依赖管理」

Dep 对象用于依赖收集，它实现了一个发布订阅模式，完成了数据 Data 和渲染视图 Watcher 的订阅，

Dep对象中的 subs 是一个数组，存放搜集到的 所有使用到这个 data 的 Watcher 对象 对象集合

```jsx
class Dep {
  // 根据 ts 类型提示，我们可以得出 Dep.target 是一个 Watcher 类型。
  static target: ?Watcher;
  // subs 存放搜集到的 Watcher 对象集合
  subs: Array<Watcher>;
  constructor() {
    this.subs = [];
  }
  addSub(sub: Watcher) {
    // 搜集所有使用到这个 data 的 Watcher 对象。
    this.subs.push(sub);
  }
  depend() {
    if (Dep.target) {
      // 搜集依赖，最终会调用上面的 addSub 方法
      Dep.target.addDep(this);
    }
  }
  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      // 调用对应的 Watcher，更新视图
      subs[i].update();
    }
  }
}
```

通过 defineReactive 方法将 data 中的数据进行响应式后，虽然可以监听到数据的变化了，但是怎么处理通知视图就更新呢？

Dep 就是收集【究竟要通知到哪里的】。

比如下面的代码案例，虽然 data 中有 text 和 message 属性，但是只有 message 被渲染到页面上，至于 text 无论怎么变化都影响不到视图的展示，因此仅仅对 message 进行收集即可，可以避免一些无用的工作。

那这个时候 message 的 Dep 就收集到了一个依赖，这个依赖就是用来管理 data 中 message 变化的。

```jsx
<div>
    <p>{{message}}</p>
</div>

data: {
  text: 'hello world',
  message: 'hello vue',
}
```

当使用 watch 属性时，也就是开发者自定义的监听某个 data 中属性的变化。

比如监听 message 的变化，message 变化时我们就要通知到 watch 这个钩子，让它去执行回调函数。

这个时候 message 的 Dep 就收集到了两个依赖，第二个依赖就是用来管理 watch 中 message 变化的。

当开发者自定义 computed 计算属性时，如下 messageT 属性，是依赖 message 的变化的。

因此 message 变化时我们也要通知到 computed，让它去执行回调函数。 

这个时候 message 的 Dep 就收集到了三个依赖，这个依赖就是用来管理 computed 中 message 变化的。

**一个属性可能有多个依赖，每个响应式数据都有一个 Dep 来管理它的依赖**

### 如何收集依赖

如何知道 data 中的某个属性被使用了，答案就是 Object.defineProperty，因为读取某个属性就会触发 get 方法。可以将代码进行如下改造

```jsx
function defineReactive(obj, key, val) {
  let Dep;// 依赖Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: () => {
      console.log("我被读了，我要不要做点什么好?");
// 被读取了，将这个依赖收集起来
      Dep.depend();// 本次新增return val;
    },
    set: (newVal) => {
      if (val === newVal) {
        return;
      }
      val = newVal;
// 被改变了，通知依赖去更新
      Dep.notify();// 本次新增console.log("数据被改变了，我要把新的值渲染到页面上去!");
    },
  });
}
```

### 什么是依赖

那所谓的依赖究竟是什么呢？上面的图中已经暴露了答案，就是 **Watcher**。

### Watcher 「中介」

Watcher 就是类似中介的角色。

比如 message 就有三个中介，当 message 变化，就通知这三个中介，他们就去执行各自需要做的变化。

Watcher 能够控制自己属于哪个，是 data 中的属性的还是 watch，或者是 computed，Watcher 自己有统一的更新入口，只要你通知它，就会执行对应的更新方法。

因此我们可以推测出，Watcher 必须要有的 2 个方法。一个就是通知变化，另一个就是被收集起来到 Dep 中去。

```jsx
class Watcher {
    addDep() {
// 我这个Watcher要被塞到Dep里去了~~
    },
    update() {
// Dep通知我更新呢~~
    },
}
```

### **大致流程**

- 发生在 beforeCreate 和 created 之间 initState(vm)中的 defineProperty
- 发生在 beforeMount 和 mounted 之间的 Dep 和 Watcher 的初始化
- 发生在 beforeUpdate 前到 updated 触发，这期间 Watcher 的相关变化

> vue将data初始化为一个Observer并对对象中的每个值，重写了其中的get、set，data中的每个key，都有一个独立的依赖收集器。
> 

> 在get中，向依赖收集器添加了监听，在mount时，实例了一个Watcher，将收集器的目标指向了当前Watcher。
> 

> 在data值发生变更时，触发set，触发了依赖收集器中的所有监听的更新，来触发Watcher.update
>