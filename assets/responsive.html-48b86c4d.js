import{_ as n,p as s,q as a,a1 as t}from"./framework-96b046e1.js";const p="/blog/assets/responsive-6adb5fe9.jpeg",e={},o=t(`<h1 id="响应式数据的原理" tabindex="-1"><a class="header-anchor" href="#响应式数据的原理" aria-hidden="true">#</a> 响应式数据的原理</h1><h2 id="_1-数据初始化" tabindex="-1"><a class="header-anchor" href="#_1-数据初始化" aria-hidden="true">#</a> 1.数据初始化</h2><h4 id="vue-项目中的-main-js" tabindex="-1"><a class="header-anchor" href="#vue-项目中的-main-js" aria-hidden="true">#</a> vue 项目中的 main.js</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">new</span> <span class="token class-name">Vue</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">&quot;#app&quot;</span><span class="token punctuation">,</span>
  router<span class="token punctuation">,</span>
  store<span class="token punctuation">,</span>
  <span class="token function-variable function">render</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">h</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">h</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Vue 实例化的过程，从 new 操作符可以看出 Vue 其实就是一个构造函数，传入的参数就是一个对象，叫做 options（选项）</p><h4 id="vue-代码类型" tabindex="-1"><a class="header-anchor" href="#vue-代码类型" aria-hidden="true">#</a> Vue 代码类型</h4><p>因为Vue是一个类，所以Vue 需要很多原型上的方法提供使用， 但是因为需要模块化这个类，因此需要写成普通的 function， <code>function Vue() { ... }</code> 再在 Vue.prototype 上增加方法， 即便是写成 class Vue的方式，在经过babel转译后，还是 function</p><h4 id="initmixin-细致拆分" tabindex="-1"><a class="header-anchor" href="#initmixin-细致拆分" aria-hidden="true">#</a> initMixin-细致拆分</h4><p>用于将所有的Vue初始化工作拆分的更细致</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> initMixin <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./init.js&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// Vue就是一个构造函数 通过new关键字进行实例化</span>
<span class="token keyword">function</span> <span class="token function">Vue</span><span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 这里开始进行Vue初始化工作</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_init</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// _init方法是挂载在Vue原型的方法 通过引入文件的方式进行原型挂载，需要传入Vue</span>
<span class="token comment">// 此做法有利于代码分割</span>
<span class="token function">initMixin</span><span class="token punctuation">(</span>Vue<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Vue<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为在 Vue 初始化可能会处理很多事情 比如数据处理、事件处理 、命周期处理等，所以划分不同文件引入利于代码分割</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> initState <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./state&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initMixin</span><span class="token punctuation">(</span><span class="token parameter">Vue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">_init</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
    <span class="token comment">// 在原型方法上，this的指向永远是实例，这里的this代表调用_init方法的对象(实例对象)</span>
    <span class="token comment">//  this.$options就是用户new Vue的时候传入的属性</span>
    vm<span class="token punctuation">.</span>$options <span class="token operator">=</span> options<span class="token punctuation">;</span>
    <span class="token comment">// 初始化状态</span>
    <span class="token function">initState</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>initMixin 把_init 方法挂载在 Vue 原型 供 Vue 实例调用</p><h4 id="initstate-初始化状态" tabindex="-1"><a class="header-anchor" href="#initstate-初始化状态" aria-hidden="true">#</a> initState-初始化状态</h4><p>组件的数据想要被控制，或者说是响应式，就需要对初始化的数据进行操作 data、props、computed、watch等等都需要 因此，需要一个方法 initState 统一处理这些初始数据 将所有的数据，都统一劫持和处理，observe实现对数据进行观测，是响应式数据核心</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> observe <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./observer/index.js&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 初始化状态 注意这里的顺序 比如我经常面试会问到 是否能在data里面直接使用prop的值 为什么？</span>
<span class="token comment">// 这里初始化的顺序依次是 prop&gt;methods&gt;data&gt;computed&gt;watch</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initState</span><span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取传入的数据对象</span>
  <span class="token keyword">const</span> opts <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">;</span>
  
  <span class="token comment">// 根据是否存在不同的数据，进行不同的初始化</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>props<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">initProps</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>methods<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">initMethod</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 初始化data</span>
    <span class="token function">initData</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>computed<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">initComputed</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>opts<span class="token punctuation">.</span>watch<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">initWatch</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 初始化data数据</span>
<span class="token keyword">function</span> <span class="token function">initData</span><span class="token punctuation">(</span><span class="token parameter">vm</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 实例的_data属性就是传入的data</span>
  <span class="token comment">// vue组件data推荐使用函数 防止数据在组件之间共享</span>
  <span class="token keyword">let</span> data <span class="token operator">=</span> vm<span class="token punctuation">.</span>$options<span class="token punctuation">.</span>data<span class="token punctuation">;</span>
  
  <span class="token comment">// data只是vm实例的data方法，跟vm没有挂钩，也就没法在vm上检测到属性是不是被劫持的</span>
	<span class="token comment">// 因此需要在data 被劫持之前，将vm 与定义的data 关联起来</span>
  data <span class="token operator">=</span> vm<span class="token punctuation">.</span>_data <span class="token operator">=</span> <span class="token keyword">typeof</span> data <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span> <span class="token operator">?</span> <span class="token function">data</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>vm<span class="token punctuation">)</span> <span class="token operator">:</span> data <span class="token operator">||</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// 把data数据代理到vm 也就是Vue实例上面 我们可以使用this.a来访问this._data.a</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> key <span class="token keyword">in</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">proxy</span><span class="token punctuation">(</span>vm<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">_data</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 对数据进行观测 --响应式数据核心</span>
  <span class="token function">observe</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">// 数据代理</span>
<span class="token comment">// 当对vm上的某一个值进行取值和操作的时候，就是对vm._data.xxx是一样的</span>
<span class="token keyword">function</span> <span class="token function">proxy</span><span class="token punctuation">(</span><span class="token parameter">object<span class="token punctuation">,</span> sourceKey<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>object<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> object<span class="token punctuation">[</span>sourceKey<span class="token punctuation">]</span><span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      object<span class="token punctuation">[</span>sourceKey<span class="token punctuation">]</span><span class="token punctuation">[</span>key<span class="token punctuation">]</span> <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>proxy(vm, </code>_data<code>, key) </code>，把data数据代理到vm，也就是Vue实例上面， 我们可以使用this.a来访问this._data.a</p><h2 id="_2-对象的数据劫持" tabindex="-1"><a class="header-anchor" href="#_2-对象的数据劫持" aria-hidden="true">#</a> 2.对象的数据劫持</h2><p>数据劫持核心是 defineReactive 函数， 主要使用 Object.defineProperty 来对数据 get 和 set 进行劫持， 这里就解决了之前的问题 为什么数据变动了会自动更新视图 -&gt; 我们可以在 set 里面去通知视图更新</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token comment">// 观测值</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 循环对数据劫持</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">walk</span><span class="token punctuation">(</span><span class="token parameter">data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 对象上的所有属性依次进行观测</span>
    <span class="token keyword">let</span> keys <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> keys<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">let</span> key <span class="token operator">=</span> keys<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">let</span> value <span class="token operator">=</span> data<span class="token punctuation">[</span>key<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token function">defineReactive</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token comment">// Object.defineProperty数据劫持核心 兼容性在ie9以及以上</span>
<span class="token keyword">function</span> <span class="token function">defineReactive</span><span class="token punctuation">(</span><span class="token parameter">data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  
  <span class="token function">observe</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span> 
  <span class="token comment">// 递归关键</span>
  <span class="token comment">// 当data 中嵌套了一个对象属性的值，进行劫持监测</span>
  <span class="token comment">// 如果value还是一个对象会继续走一遍 defineReactive </span>
  <span class="token comment">// 层层遍历一直到value不是对象才停止</span>
  <span class="token comment">//   思考？如果Vue数据嵌套层级过深 &gt;&gt; 性能会受影响</span>
  
  Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;获取值&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">set</span><span class="token punctuation">(</span>newValue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newValue <span class="token operator">===</span> value<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;设置值&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      value <span class="token operator">=</span> newValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">observe</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 如果传过来的是对象或者数组 进行属性劫持</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    <span class="token class-name">Object</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token string">&quot;[object Object]&quot;</span> <span class="token operator">||</span>
    Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Observer</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Object.defineProperty 缺点</p><blockquote><p>对象新增或者删除的属性无法被 set 监听到 只有对象本身存在的属性修改才会被劫持</p></blockquote><p>对对象进行遍历，将每个属性用defineProperty 重新定义，全量劫持，因此性能差</p><blockquote><p>这样递归的方式其实无论是对象还是数组都进行了观测 但是我们想一下此时如果 data 包含数组比如 a:[1,2,3,4,5] 那么我们根据下标可以直接修改数据也能触发 set 但是如果一个数组里面有上千上万个元素 每一个元素下标都添加 get 和 set 方法 这样对于性能来说是承担不起的 所以此方法只用来劫持对象</p></blockquote><h2 id="_3-数组的观测" tabindex="-1"><a class="header-anchor" href="#_3-数组的观测" aria-hidden="true">#</a> 3.数组的观测</h2><h4 id="判断是否是数组" tabindex="-1"><a class="header-anchor" href="#判断是否是数组" aria-hidden="true">#</a> 判断是否是数组</h4><p>用户很少通过索引操作数组， vue内部就想到不对素引进行拦截，因为性能消耗严重，内部数组不采用defineProperty push、shift、pop、unshift、reverse、sort、splice 7个方法都是变异方法，就是会更改原数组 数组的监控，核心思想是把数组的方法劫持 也就是对原来的方法进行改写，切片编程，高阶函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> arrayMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./array&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    
    <span class="token comment">// data.__ob__ = this </span>
    <span class="token comment">// 所有被劫持过的对象，都有__ob__属性</span>
    <span class="token comment">// 但是这里，__ob__是有很大的坑</span>
    <span class="token comment">// __ob__的属性是data上的，data的所有的属性都是会被动态的监听的，</span>
    <span class="token comment">// </span>
    <span class="token comment">// 因此，需要对__ob__ 进行劫持</span>
    <span class="token comment">// </span>
    <span class="token comment">// 使用 defineProperty ，设置该属性不能被循环</span>
    
    Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token string">&#39;__ob__&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">,</span>
      <span class="token literal-property property">enumerable</span><span class="token operator">:</span><span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// 不能被枚举</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    
    <span class="token comment">// </span>
    
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 这里对数组做了额外判断</span>
      <span class="token comment">// 通过重写数组原型方法来对数组的七种方法进行拦截</span>
      value<span class="token punctuation">.</span>__proto__ <span class="token operator">=</span> arrayMethods<span class="token punctuation">;</span>
      <span class="token comment">// 如果数组里面还包含数组 需要递归判断</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">walk</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token operator">...</span>
  
  <span class="token function">observeArray</span><span class="token punctuation">(</span><span class="token parameter">items</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> items<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">observe</span><span class="token punctuation">(</span>items<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="不可枚举" tabindex="-1"><a class="header-anchor" href="#不可枚举" aria-hidden="true">#</a> 不可枚举</h4><p>enumerable 这段代码的含义 给每个响应式数据增加了一个不可枚举的__ob__属性</p><p>enumerable 这段代码的<strong>原因</strong>在于</p><ul><li>data是vm.$options.data 的内容，所有的属性都是会被动态的监听的</li><li>this指代了生成的实例对象本身，this被检测，监测到有__ob__，__ob__的值是this，就会无限循环下去，就会栈溢出报错</li><li>设置不能枚举的属性，才不会被多次的遍历（defineReactive的时候，对每一次调用，都会设置set，递归设置）</li><li>可以根据这个属性来防止已经被响应式观察的数据反复被观测，其次，响应式数据可以使用__ob__来获取 Observer 实例的相关方法，因为在外部的方法中（array数组重写），需要调用类内部的方法，这里可以通过 <code>__**ob__**</code> 访问到</li></ul><h4 id="方法改写" tabindex="-1"><a class="header-anchor" href="#方法改写" aria-hidden="true">#</a> 方法改写</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 先保留数组原型</span>
<span class="token keyword">const</span> arrayProto <span class="token operator">=</span> <span class="token class-name">Array</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

<span class="token comment">// 然后将arrayMethods继承自数组原型</span>
<span class="token comment">// 这里是面向切片编程思想（AOP）-- 不破坏封装的前提下，动态的扩展功能</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> arrayMethods <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>arrayProto<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> methodsToPatch<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string">&#39;push&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;shift&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;pop&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;unshift&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;reverse&#39;</span><span class="token punctuation">,</span><span class="token string">&#39;sort&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;splice&#39;</span><span class="token punctuation">]</span>

methodsToPatch<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">method</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  arrayMethods<span class="token punctuation">[</span>method<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
   
    <span class="token keyword">const</span> result <span class="token operator">=</span> arrayProto<span class="token punctuation">[</span>method<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 这里保留原型方法的执行结果</span>
    
    <span class="token keyword">const</span> ob <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>__ob__<span class="token punctuation">;</span>
    <span class="token comment">// 这句话是关键</span>
    <span class="token comment">// this代表的就是数据本身 </span>
    <span class="token comment">// 比如数据是{a:[1,2,3]} 那么我们使用a.push(4)  </span>
    <span class="token comment">// this就是a  ob就是a.__ob__ </span>
    <span class="token comment">// 这个属性就是上段代码增加的 代表的是该数据已经被响应式观察过了指向Observer实例</span>
    
    <span class="token keyword">let</span> inserted<span class="token punctuation">;</span>
    <span class="token comment">// 这里的标志就是代表数组有新增操作</span>
    
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>method<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">case</span> <span class="token string">&quot;push&quot;</span><span class="token operator">:</span>
      <span class="token keyword">case</span> <span class="token string">&quot;unshift&quot;</span><span class="token operator">:</span>
        inserted <span class="token operator">=</span> args<span class="token punctuation">;</span> <span class="token comment">// 方法新增的内容</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token keyword">case</span> <span class="token string">&quot;splice&quot;</span><span class="token operator">:</span>
        inserted <span class="token operator">=</span> args<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// splice,需要最少3个参数，</span>
      <span class="token keyword">default</span><span class="token operator">:</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果有新增的元素 inserted是一个数组 </span>
    <span class="token comment">// 调用Observer实例的observeArray对数组每一项进行观测</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>inserted<span class="token punctuation">)</span> ob<span class="token punctuation">.</span><span class="token function">observeArray</span><span class="token punctuation">(</span>inserted<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 之后咱们还可以在这里检测到数组改变了之后从而触发视图更新的操作--后续源码会揭晓</span>
    <span class="token keyword">return</span> result<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4、总结" tabindex="-1"><a class="header-anchor" href="#_4、总结" aria-hidden="true">#</a> 4、总结</h2><p>至此，对于数据的初始化，和数据的劫持，包含了对象与数组的劫持，已经做完了， 但是对数据修改后怎么导致试图重新渲染，这块还需要结合 Watcher 和 Dep， 采用观察者模式实现依赖的收集和派发更新的过程 <img src="`+p+'" alt=""></p>',36),c=[o];function i(l,u){return s(),a("div",null,c)}const k=n(e,[["render",i],["__file","responsive.html.vue"]]);export{k as default};
