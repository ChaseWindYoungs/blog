---
title: 初始渲染原理
---

## 1.组件挂载入口

- 将 模板编译过程中，template编译成AST树，
-  compileToFunctions 方法中使用new Function 和 with， 生成可执行的 render 函数 
- 将options上挂载render方法

这个方法放在源码的 lifecycle 文件里面，代表了与生命周期相关<br />因为我们组件初始渲染前后对应有 beforeMount 和 mounted 生命周期钩子
```js

  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);

    // 如果不存在render属性
    if (!options.render) {
      // 如果存在template属性
      let template = options.template;

      if (!template && el) {
        // 如果不存在render和template 但是存在el属性 
        // 直接将模板赋值到el所在的外层html结构（就是el本身 并不是父元素）
        template = el.outerHTML;
      }

      // 最终需要把tempalte模板转化成render函数
      if (template) {
        const render = compileToFunctions(template);
        options.render = render;
      }
    }

    // 将当前组件实例挂载到真实的el节点上面
    return mountComponent(vm, el);
  };


```

## 2.组件挂载核心方法 mountComponent
```js
export function mountComponent(vm, el) {
  // 上一步模板编译解析生成了render函数
  // 下一步就是执行vm._render()方法 调用生成的render函数 生成虚拟dom
  // 最后使用vm._update()方法把虚拟dom渲染到页面

  // 真实的el选项赋值给实例的$el属性 为之后虚拟dom产生的新的dom替换老的dom做铺垫
  vm.$el = el;
  // _update和._render方法都是挂载在Vue原型的方法  类似_init
  vm._update(vm._render());
}
```
mountComponent 函数 主要使用 vm._update(vm._render())方法进行实例挂载
## 3.render 函数转化成虚拟 dom 核心方法 _render
在原型定义了_render 方法 然后执行了 render 函数<br />模板编译出来的 render 函数核心代码主要 return了类似于<br />_c('div',{id:"app"},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))这样的代码 <br />那么我们还需要定义一下 **_c、_v、_s **这些函数才能最终转化成为虚拟 dom
```js
import { createElement, createTextNode } from "./vdom/index";

export function renderMixin(Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    // 获取模板编译生成的render方法，同时也有可能是用户自己定义的render方法
    const { render } = vm.$options;
    // 生成vnode--虚拟dom
    const vnode = render.call(vm);
    return vnode;
  };

  // render函数里面有_c _v _s方法需要定义
  // 创建虚拟dom元素
  Vue.prototype._c = function (...args) {
    return createElement(...args);
  };
  
  // 创建虚拟dom文本
  Vue.prototype._v = function (text) {
    return createTextNode(text);
  };
  
  // 如果模板里面的是一个对象  需要JSON.stringify
  Vue.prototype._s = function (val) {
    return val == null
      ? ""
      : typeof val === "object"
      ? JSON.stringify(val)
      : val;
  };
}
```

新建 vdom 文件夹，代表虚拟 dom 相关功能，定义 Vnode 类，<br />以及 createElement 和 createTextNode 方法最后都返回 Vnode
```js
// 定义Vnode类
export default class Vnode {
  constructor(tag, data, key, children, text) {
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
  }
}

// 创建元素vnode 等于render函数里面的 h=>h(App)
export function createElement(tag, data = {}, ...children) {
  let key = data.key;
  return new Vnode(tag, data, key, children);
}

// 创建文本vnode
export function createTextNode(text) {
  return new Vnode(undefined, undefined, undefined, undefined, text);
}

```
## 4.虚拟 dom 转化成真实 dom 核心方法 _update
```js
import { patch } from "./vdom/patch";
export function lifecycleMixin(Vue) {
  // 把_update挂载在Vue的原型
  // update 既有初始化，又有更新
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // patch是渲染vnode为真实dom的核心
    patch(vm.$el, vnode);
  };
}
```

_update 核心方法就是 patch，<br />初始渲染和后续更新都是共用这一个方法，只是传入的第一个参数不同<br />初始渲染总体思路就是根据虚拟 dom(vnode)，调用原生 js 方法创建真实dom节点并替换掉 el 选项的位置
```js
// patch用来渲染和更新视图 这里只介绍初次渲染的逻辑
export function patch(oldVnode, vnode) {
  // 判断传入的oldVnode是否是一个真实元素
  // 这里很关键  初次渲染 传入的vm.$el就是咱们传入的el选项  所以是真实dom
  // 如果不是初始渲染而是视图更新的时候  vm.$el就被替换成了更新之前的老的虚拟dom
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 这里是初次渲染的逻辑
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;
    // 将虚拟dom转化成真实dom节点
    let el = createElm(vnode);
    // 插入到 老的el节点下一个节点的前面 就相当于插入到老的el节点的后面
    // 这里不直接使用父元素appendChild是为了不破坏替换的位置
    parentElm.insertBefore(el, oldElm.nextSibling);
    // 删除老的el节点
    parentElm.removeChild(oldVnode);
    return el;
  }
}
// 虚拟dom转成真实dom 就是调用原生方法生成dom树
function createElm(vnode) {
  let { tag, data, key, children, text } = vnode;
  //   判断虚拟dom 是元素节点还是文本节点
  if (typeof tag === "string") {
    //   虚拟dom的el属性指向真实dom
    vnode.el = document.createElement(tag);
    // 解析虚拟dom属性
    updateProperties(vnode);
    // 如果有子节点就递归插入到父节点里面
    children.forEach((child) => {
      return vnode.el.appendChild(createElm(child));
    });
  } else {
    //   文本节点
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 解析vnode的data属性 映射到真实dom上
function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el; //真实节点
  for (let key in newProps) {
    // style需要特殊处理下
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key, newProps[key]);
    }
  }
}

```
## 5._render 和_update 原型方法的混入
把定义在原型的方法引入到 Vue 主文件入口 这样所有的实例都能共享方法了
```js
import { initMixin } from "./init.js";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
// Vue就是一个构造函数 通过new关键字进行实例化
function Vue(options) {
  // 这里开始进行Vue初始化工作
  this._init(options);
}
// _init方法是挂载在Vue原型的方法 通过引入文件的方式进行原型挂载需要传入Vue
// 此做法有利于代码分割
initMixin(Vue);

// 混入_render
renderMixin(Vue);
// 混入_update
lifecycleMixin(Vue);
export default Vue;
```
## 6.模板编译的思维导图
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22233632/1653373378993-3061eeab-b8ba-4fb9-8b7f-ad775914717c.jpeg)
## 7、总结
1、html -> AST -> 可执行render方法，这一步骤是在生命周期中的$mount 上完成的，因此代码在lifecycle中，$mount也是挂载在Vue的原型上<br />2、要先执行_render 方法，再执行_update方法，lifecycleMixin 执行 _update，renderMixin 执行 _render，这些方法都是vue的原型方法<br />3、_render函数里面有_c _v _s方法需要定义，创建 虚拟dom元素 和 虚拟dom文本，然后通过调用该方法，返回虚拟DOM<br />4、将render 生成的虚拟 dom 转化成真实 dom 核心方法 就是_update<br />5、_update在lifecycle上，调用 patch方法，传入调用_render方法返回的虚拟dom，以及 vm 的el节点，通过patch 中的 createElm 以及 updateProperties 来更新老的节点，挂载新的节点，进行动态渲染<br />6、这些方法顺序挂载到index.js的vue上，顺序执行
