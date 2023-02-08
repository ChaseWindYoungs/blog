import{_ as n,p as s,q as a,a1 as t}from"./framework-96b046e1.js";const e={},p=t(`<ul><li>1、在Observer类的响应式的数据监听时，会对数组进行特殊的处理</li><li>2、对于对象的视图触发，可以让对象的属性，根据dep和watcher 的绑定来实现（通过get 和set的触发），但是数组是没有dep属性的（vue没有对数组的下标进行数据的监听），因此可以给监听对象直接绑定一个dep属性</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> arrayMethods <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./array&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">Observer</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    Object<span class="token punctuation">.</span><span class="token function">defineProperty</span><span class="token punctuation">(</span>data<span class="token punctuation">,</span> <span class="token string">&#39;__ob__&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">,</span>
      <span class="token literal-property property">enumerable</span><span class="token operator">:</span><span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// 不能被枚举</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token comment">// 在此处，希望数组的变化可以触发更新</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>1、Vue中嵌套层次不能太深，否则会有大量递归</li><li>2、 Vue中对象通过的是defineProprety实现的响应式，拦截了get和set。如果不存在的属性不会拦截。也不会响应。可以使用$set = ，让对象自己去notify，或者赋子一个新对家</li><li>3、Vue中的data，如果是单层数组，直接用下标去修改数值，是不会触发视图更新的，只有在数组是多维数组的时候，通过下标索引定位到深层次数组，通过变异方法会响更新的，只有通过变异的7个方法可以更新视图 ，数组中如果是对象类型，修改对象也可以更新视图</li></ul>`,3),o=[p];function c(l,i){return s(),a("div",null,o)}const r=n(e,[["render",c],["__file","array-update.html.vue"]]);export{r as default};
