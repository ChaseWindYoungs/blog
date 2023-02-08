---
title:  生命周期
---
# vue2 生命周期相关

### vue **组件生命周期钩子**

- beforeCreated
- created
- beforeMounted
- mounted
- beforeUpdate
- updated
- beforeDestroy
- destroyed

### vue-router

`beforeRouteEnter` // **不能**访问 this ，因为守卫在导航确认前被调用，因此即将登场的新组件还没被创建。

`beforeRouteUpdate` // 在当前路由改变，但是该组件被复用时调用

`beforeRouteLeave` // 导航离开该组件的对应路由时调用

vue-router全局有三个守卫：

1. router.beforeEach 全局前置守卫 进入路由之前
2. router.beforeResolve 全局解析守卫(2.5.0+) 在beforeRouteEnter调用之后调用
3. router.afterEach 全局后置钩子 进入路由之后

## **完整的导航解析流程**

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 。
5. 在路由配置里调用 `beforeEnter` // 路由独享的守卫。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

### keep-alive 组件

可以接收3个属性做为参数进行匹配对应的组件进行缓存

- include包含的组件(可以为字符串，数组，以及正则表达式,只有匹配的组件会被缓存)
- exclude排除的组件(以为字符串，数组，以及正则表达式,任何匹配的组件都不会被缓存)
- max缓存组件的最大值(类型为字符或者数字,可以控制缓存组件的个数)

被`keep-alive`包含的组件/路由中，会多出两个生命周期的钩子:`activated` 与 `deactivated`。

**activated在组件第一次渲染时会被调用，之后在每次缓存组件被激活时调用**

**再次进入缓存路由/组件时，不会触发这些钩子**

```jsx
beforeCreate created beforeMount mounted 都不会触发。
```

**deactivated：组件被停用(离开路由)时调用**

**使用了`keep-alive`就不会调用`beforeDestroy`(组件销毁前钩子)和`destroyed`(组件销毁)，因为组件没被销毁，被缓存起来了**。

这个钩子可以看作`beforeDestroy`的替代，如果你缓存了组件，要在组件销毁的的时候做一些事情，你可以放在这个钩子里。

### vue指令的生命周期

Vue2

自定义指令有五个生命周期（也叫钩子函数），分别是 bind,inserted,update,componentUpdated,unbind

1. bind:只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个绑定时执行一次的初始化动作。
2. inserted:被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于document中）。
3. update:被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
4. componentUpdated:被绑定元素所在模板完成一次更新周期时调用。
5. unbind:只调用一次，指令与元素解绑时调用。

Vue3

1. `created`：在绑定元素的 attribute 或事件监听器被应用之前调用。在指令需要附加在普通的 `v-on` 事件监听器调用前的事件监听器中时，这很有用。
2. `beforeMount`：当指令第一次绑定到元素并且在挂载父组件之前调用。
3. `mounted`：在绑定元素的父组件被挂载后调用。
4. `beforeUpdate`：在更新包含组件的 VNode 之前调用。
5. `updated`：在包含组件的 VNode **及其子组件的 VNode** 更新后调用。
6. `beforeUnmount`：在卸载绑定元素的父组件之前调用
7. `unmounted`：当指令与元素解除绑定且父组件已卸载时，只调用一次。

指令的参数可以是动态的。例如，在 `v-mydirective:[argument]="value"` 中，`argument` 参数可以根据组件实例数据进行更新！这使得自定义指令可以在应用中被灵活使用。

### 触发钩子的完整顺序

将路由导航、`keep-alive`、和组件生命周期钩子结合起来的，触发顺序，假设是从a组件离开，第一次进入b组件：

1. `beforeRouteLeave`:路由组件的组件离开路由前钩子，可取消路由离开。
2. `beforeEach`: 路由全局前置守卫，可用于登录验证、全局路由loading等。
3. `beforeEnter`: 路由独享守卫
4. `beforeRouteEnter`: 路由组件的组件进入路由前钩子。
5. `beforeResolve`:[路由全局解析守卫](https://link.juejin.cn/?target=https%3A%2F%2Frouter.vuejs.org%2Fzh%2Fguide%2Fadvanced%2Fnavigation-guards.html%23%25E5%2585%25A8%25E5%25B1%2580%25E8%25A7%25A3%25E6%259E%2590%25E5%25AE%2588%25E5%258D%25AB)
6. `afterEach`:路由全局后置钩子
7. `beforeCreate`:组件生命周期，不能访问`this`。
8. `created`:组件生命周期，可以访问`this`，不能访问dom。
9. `beforeMount`:组件生命周期
10. `deactivated`: 离开缓存组件a，或者触发a的`beforeDestroy`和`destroyed`组件销毁钩子。
11. `mounted`:访问/操作dom。
12. `activated`:进入缓存组件，进入a的嵌套子组件(如果有的话)。
13. 执行beforeRouteEnter回调函数next。


### 父子组件生命周期顺序

1. 挂载阶段

该过程主要涉及 beforeCreate()、created()、beforeMount()、mounted() 4 个钩子函数。执行顺序为：

父beforeCreate() -> 父created() -> 父beforeMount() -> 子beforeCreate() -> 子created() -> 子beforeMount() -> 子mounted() -> 父mounted()
一定得等子组件挂载完毕后，父组件才能挂在完毕，所以父组件的 mounted 在最后。

2. 子组件更新阶段

该过程主要涉及 beforeUpdate()、updated() 2 个钩子函数。注意，当父子组件有数据传递时，才有这个更新阶段执行顺序的比较。执行顺序为：
父beforeUpdate() -> 子beforeUpdate() -> 子updated() -> 父updated()

3. 父组件更新过程

父beforeUpdate() ->父updated()

4. 销毁阶段

该过程主要涉及beforeDestroy()、destroyed() 2 个钩子函数。执行顺序为：
父beforeDestroy() -> 子beforeDestroy() -> 子destroyed() -> 父destroyed()

5. Vue 父子组件生命周期钩子的执行顺序遵循：从外到内，再从内到外