---
title: 数组更新原理
---

- 1、在Observer类的响应式的数据监听时，会对数组进行特殊的处理
- 2、对于对象的视图触发，可以让对象的属性，根据dep和watcher 的绑定来实现（通过get 和set的触发），但是数组是没有dep属性的（vue没有对数组的下标进行数据的监听），因此可以给监听对象直接绑定一个dep属性
```javascript
import { arrayMethods } from "./array";

class Observer {
  constructor(value) {

    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable:false, // 不能被枚举
    })

    // 在此处，希望数组的变化可以触发更新
    if (Array.isArray(value)) {
      // 这里对数组做了额外判断
      // 通过重写数组原型方法来对数组的七种方法进行拦截
      value.__proto__ = arrayMethods;
      // 如果数组里面还包含数组 需要递归判断
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  ...

  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}
```


- 1、Vue中嵌套层次不能太深，否则会有大量递归
- 2、 Vue中对象通过的是defineProprety实现的响应式，拦截了get和set。如果不存在的属性不会拦截。也不会响应。可以使用$set = ，让对象自己去notify，或者赋子一个新对家
- 3、Vue中的data，如果是单层数组，直接用下标去修改数值，是不会触发视图更新的，只有在数组是多维数组的时候，通过下标索引定位到深层次数组，通过变异方法会响更新的，只有通过变异的7个方法可以更新视图 ，数组中如果是对象类型，修改对象也可以更新视图