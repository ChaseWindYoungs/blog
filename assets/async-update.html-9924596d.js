import{_ as n,p as s,q as a,a1 as e}from"./framework-96b046e1.js";const i={},t=e(`<p>Vue 渲染更新原理 咱们已经可以实现数据改变，视图自动更新了<br>那么此篇主要是对视图更新的性能优化，包含 nextTick 这一重要的 api 实现</p><p>每次我们改变数据的时候都会触发相应的 watcher 进行更新，<br>如果是渲染 watcher 那是不是意味着，数据变动一次就会重新渲染一次<br>这样其实是很浪费性能的，我们有没有更好的方法，让数据变动完毕后统一去更新视图呢</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>&lt;script&gt;
  <span class="token comment">// Vue实例化</span>
  let vm = new Vue(<span class="token punctuation">{</span>
    el<span class="token operator">:</span> <span class="token string">&quot;#app&quot;</span><span class="token punctuation">,</span>
    data() <span class="token punctuation">{</span>
      return <span class="token punctuation">{</span>
        a<span class="token operator">:</span> <span class="token number">123</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span>;
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// render(h) {</span>
    <span class="token comment">//   return h(&#39;div&#39;,{id:&#39;a&#39;},&#39;hello&#39;)</span>
    <span class="token comment">// },</span>
    template<span class="token operator">:</span> \`&lt;div id=<span class="token string">&quot;a&quot;</span>&gt;hello <span class="token punctuation">{</span><span class="token punctuation">{</span>a<span class="token punctuation">}</span><span class="token punctuation">}</span>&lt;/div&gt;\`<span class="token punctuation">,</span>
  <span class="token punctuation">}</span>);

  <span class="token comment">// 当我们每一次改变数据的时候  渲染watcher都会执行一次 这个是影响性能的</span>
  setTimeout(() =&gt; <span class="token punctuation">{</span>
    vm.a = <span class="token number">1</span>;
    vm.a = <span class="token number">2</span>;
    vm.a = <span class="token number">3</span>;
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span>);
&lt;/script&gt;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1、watcher-更新的改写" tabindex="-1"><a class="header-anchor" href="#_1、watcher-更新的改写" aria-hidden="true">#</a> 1、watcher 更新的改写</h2><p>把 update 更新方法改一下 增加异步队列的机制</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>import <span class="token punctuation">{</span> queueWatcher <span class="token punctuation">}</span> from <span class="token string">&quot;./scheduler&quot;</span>;
export default class Watcher <span class="token punctuation">{</span>
  update() <span class="token punctuation">{</span>
    <span class="token comment">// 每次watcher进行更新的时候  是否可以让他们先缓存起来  之后再一起调用</span>
    <span class="token comment">// 异步队列机制 （防抖）</span>
    queueWatcher(this);
  <span class="token punctuation">}</span>
  run() <span class="token punctuation">{</span>
    <span class="token comment">// 真正的触发更新</span>
    this.get();
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2、queuewatcher-实现队列机制" tabindex="-1"><a class="header-anchor" href="#_2、queuewatcher-实现队列机制" aria-hidden="true">#</a> 2、queueWatcher 实现队列机制</h2><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>import <span class="token punctuation">{</span> nextTick <span class="token punctuation">}</span> from <span class="token string">&quot;../util/next-tick&quot;</span>;
let queue = <span class="token punctuation">[</span><span class="token punctuation">]</span>;
let has = <span class="token punctuation">{</span><span class="token punctuation">}</span>;
function flushSchedulerQueue() <span class="token punctuation">{</span>
  for (let index = <span class="token number">0</span>; index &lt; queue.length; index++) <span class="token punctuation">{</span>
    <span class="token comment">//   调用watcher的run方法 执行真正的更新操作</span>
    queue<span class="token punctuation">[</span>index<span class="token punctuation">]</span>.run();
  <span class="token punctuation">}</span>
  <span class="token comment">// 执行完之后清空队列</span>
  queue = <span class="token punctuation">[</span><span class="token punctuation">]</span>;
  has = <span class="token punctuation">{</span><span class="token punctuation">}</span>;
<span class="token punctuation">}</span>

<span class="token comment">// 实现异步队列机制</span>
export function queueWatcher(watcher) <span class="token punctuation">{</span>
  const id = watcher.id;
  <span class="token comment">//   watcher去重</span>
  if (has<span class="token punctuation">[</span>id<span class="token punctuation">]</span> === undefined) <span class="token punctuation">{</span>
    <span class="token comment">//  同步代码执行 把全部的watcher都放到队列里面去</span>
    queue.push(watcher);
    has<span class="token punctuation">[</span>id<span class="token punctuation">]</span> = <span class="token boolean">true</span>;
    <span class="token comment">// 进行异步调用</span>
    nextTick(flushSchedulerQueue);
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3、nexttick-实现原理" tabindex="-1"><a class="header-anchor" href="#_3、nexttick-实现原理" aria-hidden="true">#</a> 3、nextTick 实现原理</h2><p>因为 nextTick 用户也可以手动调用 <br><strong>主要思路就是采用微任务优先的方式调用异步方法去执行 nextTick 包装的方法</strong></p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>let callbacks = <span class="token punctuation">[</span><span class="token punctuation">]</span>;
let pending = <span class="token boolean">false</span>;
function flushCallbacks() <span class="token punctuation">{</span>
  pending = <span class="token boolean">false</span>; <span class="token comment">//把标志还原为false</span>
  <span class="token comment">// 依次执行回调</span>
  for (let i = <span class="token number">0</span>; i &lt; callbacks.length; i++) <span class="token punctuation">{</span>
    callbacks<span class="token punctuation">[</span>i<span class="token punctuation">]</span>();
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
let timerFunc; <span class="token comment">//定义异步方法  采用优雅降级</span>
if (typeof Promise !== <span class="token string">&quot;undefined&quot;</span>) <span class="token punctuation">{</span>
  <span class="token comment">// 如果支持promise</span>
  const p = Promise.resolve();
  timerFunc = () =&gt; <span class="token punctuation">{</span>
    p.then(flushCallbacks);
  <span class="token punctuation">}</span>;
<span class="token punctuation">}</span> else if (typeof MutationObserver !== <span class="token string">&quot;undefined&quot;</span>) <span class="token punctuation">{</span>
  <span class="token comment">// MutationObserver 主要是监听dom变化 也是一个异步方法</span>
  let counter = <span class="token number">1</span>;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    characterData<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>);
  timerFunc = () =&gt; <span class="token punctuation">{</span>
    counter = (counter + <span class="token number">1</span>) % <span class="token number">2</span>;
    textNode.data = String(counter);
  <span class="token punctuation">}</span>;
<span class="token punctuation">}</span> else if (typeof setImmediate !== <span class="token string">&quot;undefined&quot;</span>) <span class="token punctuation">{</span>
  <span class="token comment">// 如果前面都不支持 判断setImmediate</span>
  timerFunc = () =&gt; <span class="token punctuation">{</span>
    setImmediate(flushCallbacks);
  <span class="token punctuation">}</span>;
<span class="token punctuation">}</span> else <span class="token punctuation">{</span>
  <span class="token comment">// 最后降级采用setTimeout</span>
  timerFunc = () =&gt; <span class="token punctuation">{</span>
    setTimeout(flushCallbacks<span class="token punctuation">,</span> <span class="token number">0</span>);
  <span class="token punctuation">}</span>;
<span class="token punctuation">}</span>

export function nextTick(cb) <span class="token punctuation">{</span>
  <span class="token comment">// 除了渲染watcher  还有用户自己手动调用的nextTick 一起被收集到数组</span>
  callbacks.push(cb);
  if (!pending) <span class="token punctuation">{</span>
    <span class="token comment">// 如果多次调用nextTick  只会执行一次异步 等异步队列清空之后再把标志变为false</span>
    pending = <span class="token boolean">true</span>;
    timerFunc();
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4、-nexttick-挂载原型" tabindex="-1"><a class="header-anchor" href="#_4、-nexttick-挂载原型" aria-hidden="true">#</a> 4、$nextTick 挂载原型</h2><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code>import <span class="token punctuation">{</span> nextTick <span class="token punctuation">}</span> from <span class="token string">&quot;./util/next-tick&quot;</span>;

export function renderMixin(Vue) <span class="token punctuation">{</span>
  <span class="token comment">// 挂载在原型的nextTick方法 可供用户手动调用</span>
  Vue.prototype.$nextTick = nextTick;
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),c=[t];function l(u,p){return s(),a("div",null,c)}const d=n(i,[["render",l],["__file","async-update.html.vue"]]);export{d as default};
