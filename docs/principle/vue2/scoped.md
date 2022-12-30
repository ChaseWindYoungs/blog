---
title: vue scoped原理
---
# Vue scoped 原理

1. scoped 表现
    
    当 style 标签加上 scoped 属性时，scoped 会在 DOM 结构及 css 样式上加上唯一性的标记 **data-v-xxx** 属性，从而达到样式私有化，不污染全局的作用。
    
2. 本质
    
    **基于 HTML 和 CSS 属性选择器**，即分别给 HTML 标签和 CSS 选择器添加 data-v-xxx
    
    **通过 vue-loader 实现** 的，实现过程大致分 3 步：
    
    - 首先 vue-loader 会解析 .vue 组件，提取出 template、script、style 对应的代码块；
    - 然后构造组件实例，在组件实例的选项上绑定 ScopedId；
    - 最后对 style 的 CSS 代码进行编译转化，应用 ScopedId 生成选择器的属性；
    
3. 原理
    
    涉及到 vue-loader 的处理策略：
    
    Vue scoped，原理，涉及到 vue-loader 的处理策略：
    
    一、首先呢，是 **VueLoaderPlugin** 策略：
    
    VueLoaderPlugin 先获取了 webpack 原来的 rules（ 即 `compiler.option.module.rule` 的比如 `test:/.vue$/` 规则），然后创建了`pitcher` 规则，pitcher 中的 **pitcher-loader** 可以通过 **resourceQuery** 识别引入文件的 **query** 带的关键字，进行 **loader** 解析；（pitcher-loader 提供了前置运行和熔断运行的机制）
    
    然后 VueLoaderPlugin 将进行 `clonedRule`（ 即对 **vueRule** 以外的 rule 进行处理），具体是重写 **resource** 和 **resourceQuery**，使得 loader 最终能匹配上文件；
    
    举例：对于 vue+ts 的写法，会在 vue 的 script 标签中加上 **lang='ts’**，重写后 **fakeresourceQuery** 文件路径为 xx.vue.ts，然后结合**ts-loader** 的 resource 过滤方法`/.tsx?$/` 匹配上文件
    
    然后才来到：`vueRule` 的 vue-loader 执行阶段；
    
    （VueLoaderPlugin 就是来处理 rule 的，让 loader 能够和文件匹配。处理顺序：`pitcher` ⇒ `clonedRule` ⇒ `vueRule`）
    
    二、  有了上面的匹配文件，接着来到了 **vue-loader** 处理环节，
    
    首先 `@vue/component-compiler-utils` `.parse` 方法可以将 .vue 文件按照 **template/script/style** 分成代码块，
    
    此时会根据文件路径和文件内容生成 `hash` 值，并赋给 id ，跟在文件参数后面；
    
    三、`stylePostLoader` 
    
    对于 style 代码块，vue-loader 会在 css-loader 前增加`stylePostLoader`，
    
    `stylePostLoader` 正是 Vue scoped 的原理核心之一，它会给每个选择器增加属性`[data-v-hash]` ，
    
    这里的 hash 值就是上面的 id 值；
    
    四、data-v-hash 
    
    同时，对于 template 的 render 块，vue-loader 的 `normalizeComponent` 方法，判断如果 vue 文件中有 scoped 的 style，则其返回的 **`options._ScopedId`** 为上面的 scopedId；
    
    在 vnode 渲染生成 DOM 的时候会在 dom元素上增增加 scopedId，也就是增加 data-v-hash。