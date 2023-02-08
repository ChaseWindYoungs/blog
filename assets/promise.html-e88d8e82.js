import{_ as p,M as e,p as o,q as c,R as n,t as a,N as t,a1 as l}from"./framework-96b046e1.js";const i={},u=l(`<h1 id="promise" tabindex="-1"><a class="header-anchor" href="#promise" aria-hidden="true">#</a> Promise</h1><p>Promise基本原理</p><p>1、Promise 是一个类，在执行这个类的时候，会传入一个执行器，这个执行器会立即执行</p><p>2、Promise 有三个状态</p><p><code>Pending 等待</code></p><p><code>Fulfilled 完成</code></p><p><code>Rejected 失败</code></p><p>3、状态只能由 Pending --&gt; Fulfilled， 或者 Pending --&gt; Rejected ，并且一旦发生改变就不能修改</p><p>4、Promise中使用 resolve 和 reject 来改变状态</p><p>5、then方法中做的事儿就是状态的判断，</p><p><code>如果状态是成功，调用成功的回调函数</code></p><p><code>如果状态是失败，调用失败的回调函数</code></p><h3 id="一、promise核心逻辑的实现" tabindex="-1"><a class="header-anchor" href="#一、promise核心逻辑的实现" aria-hidden="true">#</a> 一、Promise核心逻辑的实现</h3><p>1、新建 MyPromise 类，传入 执行器 executor</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span> <span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// exevutor 是一个执行器，会立即执行</span>
        <span class="token function">executor</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、executor 执行器传入 resolve 和 reject 方法</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// exevutor 是一个执行器，会立即执行</span>
        <span class="token comment">// 并传入resolve和reject方法</span>
        <span class="token comment">// 为什么要用this去接，因为这是 MyPromise 内部的方法</span>
        <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>    
    <span class="token punctuation">}</span>
    <span class="token comment">// 为什么 要用箭头函数？ </span>
    <span class="token comment">// 因为如果直接调用的话，普通函数的this会直接指向 window 或者 undefined</span>
    <span class="token comment">// 用箭头函数就可以让this指向当前实例对象</span>
    
    <span class="token comment">// 更改成功后的状态</span>
    <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    
    <span class="token comment">// 更改失败后的状态</span>
    <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、状态与结果的管理</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 存储状态的变量，初始值是pending</span>
    status <span class="token operator">=</span> <span class="token constant">PENDING</span>

    <span class="token comment">// 成功之后的值</span>
    value <span class="token operator">=</span> <span class="token keyword">null</span>

    <span class="token comment">// 失败之后的值</span>
    reason <span class="token operator">=</span> <span class="token keyword">null</span>

    <span class="token comment">// 更改成功后的状态</span>
    <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        
        <span class="token comment">// 只有状态是等待，才能执行状态修改</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 修改状态为成功</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
            <span class="token comment">// 保存成功之后的值</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value 
        <span class="token punctuation">}</span>
        
    <span class="token punctuation">}</span>
    <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// 只有状态是等待，才能执行状态修改</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 修改状态为成功</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
            <span class="token comment">// 保存成功之后的值</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason 
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>then 的简单实现</li></ol><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    status<span class="token operator">=</span><span class="token constant">PENDING</span>

    value <span class="token operator">=</span> <span class="token keyword">null</span>
    reason <span class="token operator">=</span> <span class="token keyword">null</span>
    <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 判断状态</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
            <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
            <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 5、使用 module.exports 对外暴露 MyPromise 类</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> MyPromise<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>5、使用 module.exports 对外暴露 MyPromise 类</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code>module<span class="token punctuation">.</span>exports <span class="token operator">=</span> MyPromise<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>test</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// Promise.resolve().then(() =&gt; {</span>
<span class="token comment">//     console.log(0);</span>
<span class="token comment">//     return Promise.resolve(4);</span>
<span class="token comment">// }).then((res) =&gt; {</span>
<span class="token comment">//     console.log(res)</span>
<span class="token comment">// })</span>

<span class="token comment">// Promise.resolve().then(() =&gt; {</span>
<span class="token comment">//     console.log(1);</span>
<span class="token comment">// }).then(() =&gt; {</span>
<span class="token comment">//     console.log(2);</span>
<span class="token comment">// }).then(() =&gt; {</span>
<span class="token comment">//     console.log(3);</span>
<span class="token comment">// }).then(() =&gt; {</span>
<span class="token comment">//     console.log(5);</span>
<span class="token comment">// }).then(() =&gt;{</span>
<span class="token comment">//     console.log(6);</span>
<span class="token comment">// })</span>

<span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise1.js&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
    <span class="token function">reject</span><span class="token punctuation">(</span><span class="token string">&#39;err&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

 promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;reject&#39;</span><span class="token punctuation">,</span> reason<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="二、在-promise-类中加入异步逻辑" tabindex="-1"><a class="header-anchor" href="#二、在-promise-类中加入异步逻辑" aria-hidden="true">#</a> 二、在 Promise 类中加入异步逻辑</h3><p>MyPromise 类</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code> <span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
     <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
     <span class="token punctuation">}</span>
     status<span class="token operator">=</span><span class="token constant">PENDING</span>
 
     value <span class="token operator">=</span> <span class="token keyword">null</span>
     reason <span class="token operator">=</span> <span class="token keyword">null</span>
     <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token comment">// 判断状态</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
             <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
         <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
             <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1、缓存成功与失败回调</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
     <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
     <span class="token punctuation">}</span>
     status<span class="token operator">=</span><span class="token constant">PENDING</span>
 
     value <span class="token operator">=</span> <span class="token keyword">null</span>
     reason <span class="token operator">=</span> <span class="token keyword">null</span>
     <span class="token comment">// ======== new ==========</span>
     <span class="token comment">// 存储 成功的回调函数</span>
     onFulfilledCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

     <span class="token comment">// 存储 失败的回调函数</span>
     onRejeectedCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

     <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token comment">// 判断状态</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
             <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
         <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
             <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
         <span class="token punctuation">}</span> 
     <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、then 方法中的 Pending 的处理</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
     <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
     <span class="token punctuation">}</span>
     status<span class="token operator">=</span><span class="token constant">PENDING</span>
 
     value <span class="token operator">=</span> <span class="token keyword">null</span>
     reason <span class="token operator">=</span> <span class="token keyword">null</span>
     <span class="token comment">// 存储 成功的回调函数</span>
     onFulfilledCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

     <span class="token comment">// 存储 失败的回调函数</span>
     onRejeectedCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

     <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token comment">// 判断状态</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
             <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
         <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
             <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
         <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// == new ==</span>
            <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
            <span class="token comment">// 等到执行成功或者失败函数的时候再传递</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback <span class="token operator">=</span> onFulfilled
            <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback <span class="token operator">=</span> onFulfilled
        <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、resolve 与 reject 中调用回调函数</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
 <span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
     <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
     <span class="token punctuation">}</span>
     status<span class="token operator">=</span><span class="token constant">PENDING</span>
 
     value <span class="token operator">=</span> <span class="token keyword">null</span>
     reason <span class="token operator">=</span> <span class="token keyword">null</span>
     <span class="token comment">// 存储 成功的回调函数</span>
     onFulfilledCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

     <span class="token comment">// 存储 失败的回调函数</span>
     onRejeectedCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

     <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
             <span class="token comment">// == new ==</span>
             <span class="token comment">// 判断成功回调是否存在，如果存在，就调用</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onFulfilledCallback</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
             <span class="token comment">// == new ==</span>
             <span class="token comment">// 判断失败回调是否存在，如果存在，就调用</span>
             <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onRejeectedCallback</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
         <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
     <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token comment">// 判断状态</span>
         <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
             <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
         <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
             <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
             <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
         <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
            <span class="token comment">// 等到执行成功或者失败函数的时候再传递</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback <span class="token operator">=</span> onFulfilled
            <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback <span class="token operator">=</span> onFulfilled
        <span class="token punctuation">}</span>
     <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>test</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise2.js&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
<span class="token punctuation">}</span><span class="token punctuation">)</span>

promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;reject&#39;</span><span class="token punctuation">,</span> reason<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="三、实现-then-方法-多次调用-添加多个处理函数" tabindex="-1"><a class="header-anchor" href="#三、实现-then-方法-多次调用-添加多个处理函数" aria-hidden="true">#</a> 三、实现 then 方法 多次调用 添加多个处理函数</h3><ul><li>Promise 的 then 方法是可以被多次调用的，</li><li>如果有三个then的调用，如果是同步回调，那么直接返回当前的值就行，</li><li>如果是异步回调，那么保存的成功失败的回调，需要用不同的值来保存</li><li>因为都互不相同</li></ul><p>1、在 MyPromise 中新增两个数组</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    status<span class="token operator">=</span><span class="token constant">PENDING</span>

    value <span class="token operator">=</span> <span class="token keyword">null</span>
    reason <span class="token operator">=</span> <span class="token keyword">null</span>
		<span class="token comment">// 存储 成功的回调函数</span>
		<span class="token comment">// ============ new ============</span>
		<span class="token comment">//  onFulfilledCallback = null;</span>
		onFulfilledCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
		<span class="token comment">// 存储 失败的回调函数</span>
		<span class="token comment">//  onRejeectedCallback = null;</span>
		onRejeectedCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
            <span class="token comment">// == new ==</span>
            <span class="token comment">// 判断成功回调是否存在，如果存在，就调用</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onFulfilledCallback</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
            <span class="token comment">// == new ==</span>
            <span class="token comment">// 判断失败回调是否存在，如果存在，就调用</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onRejeectedCallback</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 判断状态</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
            <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
            <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
		        <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
		        <span class="token comment">// 等到执行成功或者失败函数的时候再传递</span>
		        <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback <span class="token operator">=</span> onFulfilled
		        <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback <span class="token operator">=</span> onFulfilled
		    <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、回调函数存在数组中</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
  <span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    status<span class="token operator">=</span><span class="token constant">PENDING</span>

    value <span class="token operator">=</span> <span class="token keyword">null</span>
    reason <span class="token operator">=</span> <span class="token keyword">null</span>
    <span class="token comment">// 存储 成功的回调函数</span>
    <span class="token comment">//  onFulfilledCallback = null;</span>
     onFulfilledCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
     <span class="token comment">// 存储 失败的回调函数</span>
     onRejeectedCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    onRejeectedCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
            
            <span class="token comment">// 判断成功回调是否存在，如果存在，就调用</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onFulfilledCallback</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
            <span class="token comment">// 判断失败回调是否存在，如果存在，就调用</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onRejeectedCallback</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 判断状态</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
            <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
            <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
            <span class="token comment">// 等到执行成功或者失败函数的时候再传递</span>
            <span class="token comment">// == new ==</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onFulfilled<span class="token punctuation">)</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onFulfilled<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>3、循环成功和失败的回调</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
  <span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
    <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    status<span class="token operator">=</span><span class="token constant">PENDING</span>

    value <span class="token operator">=</span> <span class="token keyword">null</span>
    reason <span class="token operator">=</span> <span class="token keyword">null</span>
    <span class="token comment">// 存储 成功的回调函数</span>
    <span class="token comment">// == new ==</span>
    <span class="token comment">//  onFulfilledCallback = null;</span>
    onFulfilledCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token comment">// 存储 失败的回调函数</span>
    <span class="token comment">//  onRejeectedCallback = null;</span>
    onRejeectedCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

    <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
            <span class="token comment">// 判断成功回调是否存在，如果存在，就调用</span>
            <span class="token comment">// == new ==</span>

            <span class="token comment">// resolve 里面将所有成功的回调拿出来执行</span>
            <span class="token comment">// this.onFulfilledCallback &amp;&amp; this.onFulfilledCallback(value)</span>
            <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// Array.shift() 取出数组的第一个元素，然后传入参数调用</span>
                <span class="token comment">// shift不是纯函数，取出后，数组将失去该元素，直到数组为空</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    
    <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
            <span class="token comment">// 判断失败回调是否存在，如果存在，就调用</span>
            <span class="token comment">// == new ==</span>
            <span class="token comment">// reject 里面将所有失败的回调拿出来执行</span>

            <span class="token comment">// this.onRejeectedCallback &amp;&amp; this.onRejeectedCallback(value)</span>
            <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// Array.shift() 取出数组的第一个元素，然后传入参数调用</span>
                <span class="token comment">// shift不是纯函数，取出后，数组将失去该元素，直到数组为空</span>
                <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 判断状态</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把值返回</span>
            <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用成功的回调函数，并且把原因返回</span>
            <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
            <span class="token comment">// 等到执行成功或者失败函数的时候再传递</span>
            
            <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onFulfilled<span class="token punctuation">)</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onFulfilled<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>test</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise3.js&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">2000</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
<span class="token punctuation">}</span><span class="token punctuation">)</span>

promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
 
promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token comment">// 3</span>
<span class="token comment">// resolve success</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="四、实现-then-方法-的链式调用" tabindex="-1"><a class="header-anchor" href="#四、实现-then-方法-的链式调用" aria-hidden="true">#</a> 四、实现 then 方法 的链式调用</h3><ul><li>then方法要链式调用的话，就需要返回一个Promise对象</li><li>then方法里面 return 一个返回值，作为下一个 then方法的参数，</li><li>如果 return 一个 Promise对象，就需要判断它的状态</li></ul><p>1、创建一个 MyPromise，并在后面 return 出去</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  status<span class="token operator">=</span><span class="token constant">PENDING</span>

  value <span class="token operator">=</span> <span class="token keyword">null</span>
  reason <span class="token operator">=</span> <span class="token keyword">null</span>
  <span class="token comment">// 存储 成功的回调函数</span>
  <span class="token comment">// == new ==</span>
  <span class="token comment">//  onFulfilledCallback = null;</span>
  onFulfilledCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token comment">// 存储 失败的回调函数</span>
  <span class="token comment">//  onRejeectedCallback = null;</span>
  onRejeectedCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
          <span class="token comment">// 判断成功回调是否存在，如果存在，就调用</span>
          <span class="token comment">// == new ==</span>

          <span class="token comment">// resolve 里面将所有成功的回调拿出来执行</span>
          <span class="token comment">// this.onFulfilledCallback &amp;&amp; this.onFulfilledCallback(value)</span>
          <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token comment">// Array.shift() 取出数组的第一个元素，然后传入参数调用</span>
              <span class="token comment">// shift不是纯函数，取出后，数组将失去该元素，直到数组为空</span>
              <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  
  <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
          <span class="token comment">// 判断失败回调是否存在，如果存在，就调用</span>
          <span class="token comment">// == new ==</span>
          <span class="token comment">// reject 里面将所有失败的回调拿出来执行</span>

          <span class="token comment">// this.onRejeectedCallback &amp;&amp; this.onRejeectedCallback(value)</span>
          <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token comment">// Array.shift() 取出数组的第一个元素，然后传入参数调用</span>
              <span class="token comment">// shift不是纯函数，取出后，数组将失去该元素，直到数组为空</span>
              <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ==== 新增 ====</span>
    <span class="token comment">// 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去</span>
    <span class="token keyword">const</span> promise2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token comment">// 这里的内容在执行器中，会立即执行</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取成功回调函数的执行结果</span>
        <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 传入 resolvePromise 集中处理</span>
        <span class="token function">resolvePromise</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onFulfilled<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onRejectedCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onRejected<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span> 
    
    <span class="token keyword">return</span> promise2<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">resolvePromise</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 判断x是不是 MyPromise 实例对象</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>x <span class="token keyword">instanceof</span> <span class="token class-name">MyPromise</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected</span>
    <span class="token comment">// x.then(value =&gt; resolve(value), reason =&gt; reject(reason))</span>
    <span class="token comment">// 简化之后</span>
    x<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span><span class="token punctuation">{</span>
    <span class="token comment">// 普通值</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>test</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token comment">// 目前这里只处理同步的问题</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">function</span> <span class="token function">other</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span><span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;other&#39;</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
  <span class="token keyword">return</span> <span class="token function">other</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="五、then-方法链式调用识别-promise-是否返回自己" tabindex="-1"><a class="header-anchor" href="#五、then-方法链式调用识别-promise-是否返回自己" aria-hidden="true">#</a> <strong>五、then 方法链式调用识别 Promise 是否返回自己</strong></h3><blockquote><p>如果 then 方法返回的是自己的 Promise 对象，则会发生循环调用，这个时候程序会报错</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> p1 <span class="token operator">=</span> promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
  <span class="token keyword">return</span> p1
<span class="token punctuation">}</span><span class="token punctuation">)</span>

输出
<span class="token number">100</span>
<span class="token function">Uncaught</span> <span class="token punctuation">(</span><span class="token keyword">in</span> promise<span class="token punctuation">)</span> TypeError<span class="token operator">:</span> Chaining cycle detected <span class="token keyword">for</span> promise #<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Promise</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
</span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在MyPromise 中实现</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">function</span> <span class="token function">resolvePromise</span><span class="token punctuation">(</span><span class="token parameter">promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 如果相等了，说明return的是自己，抛出类型错误并返回</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>promise2 <span class="token operator">===</span> x<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">reject</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token string">&#39;Chaining cycle detected for promise #&lt;Promise&gt;&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>x <span class="token keyword">instanceof</span> <span class="token class-name">MyPromise</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    x<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span><span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
               <span class="token operator">^</span>
<span class="token literal-property property">ReferenceError</span><span class="token operator">:</span> Cannot access <span class="token string">&#39;promise2&#39;</span> before initialization
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为啥会报错呢？</p><p>从错误提示可以看出，我们必须要等 promise2 完成初始化。</p><p>这个时候我们就要用上宏微任务和事件循环的知识了，</p><p>这里就需要创建一个异步函数去等待 promise2 完成初始化，前面我们已经确认了创建微任务的技术方案 --&gt; <code>queueMicrotask</code></p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  status<span class="token operator">=</span><span class="token constant">PENDING</span>

  value <span class="token operator">=</span> <span class="token keyword">null</span>
  reason <span class="token operator">=</span> <span class="token keyword">null</span>
  <span class="token comment">// 存储 成功的回调函数</span>
  <span class="token comment">// == new ==</span>
  <span class="token comment">//  onFulfilledCallback = null;</span>
  onFulfilledCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
  <span class="token comment">// 存储 失败的回调函数</span>
  <span class="token comment">//  onRejeectedCallback = null;</span>
  onRejeectedCallback <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

  <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value
          <span class="token comment">// 判断成功回调是否存在，如果存在，就调用</span>
          <span class="token comment">// == new ==</span>

          <span class="token comment">// resolve 里面将所有成功的回调拿出来执行</span>
          <span class="token comment">// this.onFulfilledCallback &amp;&amp; this.onFulfilledCallback(value)</span>
          <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token comment">// Array.shift() 取出数组的第一个元素，然后传入参数调用</span>
              <span class="token comment">// shift不是纯函数，取出后，数组将失去该元素，直到数组为空</span>
              <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallback<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  
  <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason
          <span class="token comment">// 判断失败回调是否存在，如果存在，就调用</span>
          <span class="token comment">// == new ==</span>
          <span class="token comment">// reject 里面将所有失败的回调拿出来执行</span>

          <span class="token comment">// this.onRejeectedCallback &amp;&amp; this.onRejeectedCallback(value)</span>
          <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              <span class="token comment">// Array.shift() 取出数组的第一个元素，然后传入参数调用</span>
              <span class="token comment">// shift不是纯函数，取出后，数组将失去该元素，直到数组为空</span>
              <span class="token keyword">this</span><span class="token punctuation">.</span>onRejeectedCallback<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span>
          <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// ==== 新增 ====</span>
    <span class="token comment">// 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去</span>
    <span class="token keyword">const</span> promise2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token comment">// 这里的内容在执行器中，会立即执行</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// ==== 新增 ====</span>
        <span class="token comment">// 创建一个微任务等待 promise2 完成初始化</span>
        <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token comment">// 获取成功回调函数的执行结果</span>
          <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token comment">// 传入 resolvePromise 集中处理</span>
          <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>  
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onFulfilled<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onRejectedCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onRejected<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span> 
    
    <span class="token keyword">return</span> promise2<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">resolvePromise</span><span class="token punctuation">(</span><span class="token parameter">x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 判断x是不是 MyPromise 实例对象</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>x <span class="token keyword">instanceof</span> <span class="token class-name">MyPromise</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected</span>
    <span class="token comment">// x.then(value =&gt; resolve(value), reason =&gt; reject(reason))</span>
    <span class="token comment">// 简化之后</span>
    x<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span><span class="token punctuation">{</span>
    <span class="token comment">// 普通值</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>test</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// test.js</span>

<span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
 
<span class="token comment">// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise</span>
<span class="token keyword">const</span> p1 <span class="token operator">=</span> promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
   console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
   console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
   <span class="token keyword">return</span> p1
<span class="token punctuation">}</span><span class="token punctuation">)</span>
 
<span class="token comment">// 运行的时候会走reject</span>
p1<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>reason<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

结果

<span class="token number">1</span>
resolve success
<span class="token number">3</span>
Chaining cycle detected <span class="token keyword">for</span> promise #<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">Promise</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
</span></code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="六、捕获错误及-then-链式调用其他状态代码补充" tabindex="-1"><a class="header-anchor" href="#六、捕获错误及-then-链式调用其他状态代码补充" aria-hidden="true">#</a> <strong>六、捕获错误及 then 链式调用其他状态代码补充</strong></h3><p>1、捕获执行器错误</p><blockquote><p>捕获执行器中的代码，如果执行器中有代码错误，那么 Promise 的状态要变为失败</p></blockquote><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// MyPromise.js</span>

<span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
  <span class="token comment">// ==== 新增 ====</span>
  <span class="token comment">// executor 是一个执行器，进入会立即执行</span>
  <span class="token comment">// 并传入resolve和reject方法</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果有错误，就直接执行 reject</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>test</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// test.js</span>

<span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// resolve(&#39;success&#39;)</span>
    <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&#39;执行器错误&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
 
promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>reason<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token number">2</span>
执行器错误
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、then 执行的时错误捕获</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// MyPromise.js</span>

<span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去</span>
  <span class="token keyword">const</span> promise2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// 判断状态</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 创建一个微任务等待 promise2 完成初始化</span>
      <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// ==== 新增 ====</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
          <span class="token comment">// 获取成功回调函数的执行结果</span>
          <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token comment">// 传入 resolvePromise 集中处理</span>
          <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>  
      <span class="token punctuation">}</span><span class="token punctuation">)</span>  
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 调用失败回调，并且把原因返回</span>
      <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 等待</span>
      <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
      <span class="token comment">// 等到执行成功失败函数的时候再传递</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onFulfilled<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>onRejectedCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>onRejected<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span> 
  
  <span class="token keyword">return</span> promise2<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>test</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// test.js</span>

<span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;success&#39;</span><span class="token punctuation">)</span>
    <span class="token comment">// throw new Error(&#39;执行器错误&#39;)</span>
 <span class="token punctuation">}</span><span class="token punctuation">)</span>
 
<span class="token comment">// 第一个then方法中的错误要在第二个then方法中捕获到</span>
promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;resolve&#39;</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span>
  <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&#39;then error&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>reason<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>reason<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

结果
<span class="token number">1</span>
resolve success
<span class="token number">4</span>
then error
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="七、参考-fulfilled-状态下的处理方式-对-rejected-和-pending-状态进行改造" tabindex="-1"><a class="header-anchor" href="#七、参考-fulfilled-状态下的处理方式-对-rejected-和-pending-状态进行改造" aria-hidden="true">#</a> <strong>七、参考 fulfilled 状态下的处理方式，对 rejected 和 pending 状态进行改造</strong></h3><ol><li>增加异步状态下的链式调用</li><li>增加回调函数执行结果的判断</li><li>增加识别 Promise 是否返回自己</li><li>增加错误捕获</li></ol><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// MyPromise.js</span>

<span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去</span>
  <span class="token keyword">const</span> promise2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// 判断状态</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 创建一个微任务等待 promise2 完成初始化</span>
      <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
          <span class="token comment">// 获取成功回调函数的执行结果</span>
          <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token comment">// 传入 resolvePromise 集中处理</span>
          <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> 
      <span class="token punctuation">}</span><span class="token punctuation">)</span>  
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
      <span class="token comment">// ==== 新增 ====</span>
      <span class="token comment">// 创建一个微任务等待 promise2 完成初始化</span>
      <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
          <span class="token comment">// 调用失败回调，并且把原因返回</span>
          <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token comment">// 传入 resolvePromise 集中处理</span>
          <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
        <span class="token punctuation">}</span> 
      <span class="token punctuation">}</span><span class="token punctuation">)</span> 
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 等待</span>
      <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
      <span class="token comment">// 等到执行成功失败函数的时候再传递</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// ==== 新增 ====</span>
        <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">// 获取成功回调函数的执行结果</span>
            <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">onFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 传入 resolvePromise 集中处理</span>
            <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
          <span class="token punctuation">}</span> 
        <span class="token punctuation">}</span><span class="token punctuation">)</span> 
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>onRejectedCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// ==== 新增 ====</span>
        <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用失败回调，并且把原因返回</span>
            <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">onRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 传入 resolvePromise 集中处理</span>
            <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
          <span class="token punctuation">}</span> 
        <span class="token punctuation">}</span><span class="token punctuation">)</span> 
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span> 
  
  <span class="token keyword">return</span> promise2<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="八、then-中的参数变为可选" tabindex="-1"><a class="header-anchor" href="#八、then-中的参数变为可选" aria-hidden="true">#</a> <strong>八、then 中的参数变为可选</strong></h3><p>上面我们处理 then 方法的时候都是默认传入 onFulfilled、onRejected 两个回调函数，</p><p>但是实际上原生 Promise 是可以选择参数的单传或者不传，都不会影响执行。</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// MyPromise.js</span>

<span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 如果不传，就使用默认函数</span>
  onFulfilled <span class="token operator">=</span> <span class="token keyword">typeof</span> onFulfilled <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">?</span> <span class="token function-variable function">onFulfilled</span> <span class="token operator">:</span> <span class="token parameter">value</span> <span class="token operator">=&gt;</span> value<span class="token punctuation">;</span>
  onRejected <span class="token operator">=</span> <span class="token keyword">typeof</span> onRejected <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">?</span> <span class="token function-variable function">onRejected</span> <span class="token operator">:</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span><span class="token keyword">throw</span> reason<span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去</span>
  <span class="token keyword">const</span> promise2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span><span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>test</p><p>resolve 之后</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;succ&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
 
promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">// 打印 succ</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>reject 之后</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">const</span> MyPromise <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;./MyPromise&#39;</span><span class="token punctuation">)</span>
<span class="token keyword">const</span> promise <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token function">reject</span><span class="token punctuation">(</span><span class="token string">&#39;err&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
 
promise<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">value</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span><span class="token punctuation">)</span>

<span class="token comment">// 打印 err</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="九、实现-resolve-与-reject-的静态调用" tabindex="-1"><a class="header-anchor" href="#九、实现-resolve-与-reject-的静态调用" aria-hidden="true">#</a> <strong>九、实现 resolve 与 reject 的静态调用</strong></h3><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// MyPromise.js</span>

MyPromise <span class="token punctuation">{</span>
  <span class="token operator">...</span><span class="token operator">...</span>
  <span class="token comment">// resolve 静态方法</span>
  <span class="token keyword">static</span> <span class="token function">resolve</span> <span class="token punctuation">(</span><span class="token parameter">parameter</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果传入 MyPromise 就直接返回</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>parameter <span class="token keyword">instanceof</span> <span class="token class-name">MyPromise</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> parameter<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 转成常规方式</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token parameter">resolve</span> <span class="token operator">=&gt;</span>  <span class="token punctuation">{</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span>parameter<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// reject 静态方法</span>
  <span class="token keyword">static</span> <span class="token function">reject</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">reject</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>总结</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// MyPromise.js</span>

<span class="token comment">// 先定义三个常量表示状态</span>
<span class="token keyword">const</span> <span class="token constant">PENDING</span> <span class="token operator">=</span> <span class="token string">&#39;pending&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">FULFILLED</span> <span class="token operator">=</span> <span class="token string">&#39;fulfilled&#39;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">REJECTED</span> <span class="token operator">=</span> <span class="token string">&#39;rejected&#39;</span><span class="token punctuation">;</span>

<span class="token comment">// 新建 MyPromise 类</span>
<span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">executor</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// executor 是一个执行器，进入会立即执行</span>
    <span class="token comment">// 并传入resolve和reject方法</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token function">executor</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 储存状态的变量，初始值是 pending</span>
  status <span class="token operator">=</span> <span class="token constant">PENDING</span><span class="token punctuation">;</span>
  <span class="token comment">// 成功之后的值</span>
  value <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 失败之后的原因</span>
  reason <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token comment">// 存储成功回调函数</span>
  onFulfilledCallbacks <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token comment">// 存储失败回调函数</span>
  onRejectedCallbacks <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token comment">// 更改成功后的状态</span>
  <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// 只有状态是等待，才执行状态修改</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 状态修改为成功</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">FULFILLED</span><span class="token punctuation">;</span>
      <span class="token comment">// 保存成功之后的值</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value<span class="token punctuation">;</span>
      <span class="token comment">// resolve里面将所有成功的回调拿出来执行</span>
      <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 更改失败后的状态</span>
  <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token comment">// 只有状态是等待，才执行状态修改</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 状态成功为失败</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">=</span> <span class="token constant">REJECTED</span><span class="token punctuation">;</span>
      <span class="token comment">// 保存失败后的原因</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>reason <span class="token operator">=</span> reason<span class="token punctuation">;</span>
      <span class="token comment">// resolve里面将所有失败的回调拿出来执行</span>
      <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>onRejectedCallbacks<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onRejectedCallbacks<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">onFulfilled<span class="token punctuation">,</span> onRejected</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> realOnFulfilled <span class="token operator">=</span> <span class="token keyword">typeof</span> onFulfilled <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">?</span> <span class="token function-variable function">onFulfilled</span> <span class="token operator">:</span> <span class="token parameter">value</span> <span class="token operator">=&gt;</span> value<span class="token punctuation">;</span>
    <span class="token keyword">const</span> realOnRejected <span class="token operator">=</span> <span class="token keyword">typeof</span> onRejected <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span> <span class="token operator">?</span> <span class="token function-variable function">onRejected</span> <span class="token operator">:</span> <span class="token parameter">reason</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span><span class="token keyword">throw</span> reason<span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token comment">// 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去</span>
    <span class="token keyword">const</span> promise2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token function-variable function">fulfilledMicrotask</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>  <span class="token punctuation">{</span>
        <span class="token comment">// 创建一个微任务等待 promise2 完成初始化</span>
        <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">// 获取成功回调函数的执行结果</span>
            <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">realOnFulfilled</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 传入 resolvePromise 集中处理</span>
            <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
          <span class="token punctuation">}</span> 
        <span class="token punctuation">}</span><span class="token punctuation">)</span>  
      <span class="token punctuation">}</span>

      <span class="token keyword">const</span> <span class="token function-variable function">rejectedMicrotask</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> 
        <span class="token comment">// 创建一个微任务等待 promise2 完成初始化</span>
        <span class="token function">queueMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">// 调用失败回调，并且把原因返回</span>
            <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">realOnRejected</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 传入 resolvePromise 集中处理</span>
            <span class="token function">resolvePromise</span><span class="token punctuation">(</span>promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>
          <span class="token punctuation">}</span> 
        <span class="token punctuation">}</span><span class="token punctuation">)</span> 
      <span class="token punctuation">}</span>
      <span class="token comment">// 判断状态</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">FULFILLED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">fulfilledMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">)</span> 
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token function">rejectedMicrotask</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>status <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 等待</span>
        <span class="token comment">// 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来</span>
        <span class="token comment">// 等到执行成功失败函数的时候再传递</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onFulfilledCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>fulfilledMicrotask<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>onRejectedCallbacks<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>rejectedMicrotask<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span> 
    
    <span class="token keyword">return</span> promise2<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// resolve 静态方法</span>
  <span class="token keyword">static</span> <span class="token function">resolve</span> <span class="token punctuation">(</span><span class="token parameter">parameter</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果传入 MyPromise 就直接返回</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>parameter <span class="token keyword">instanceof</span> <span class="token class-name">MyPromise</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> parameter<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 转成常规方式</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token parameter">resolve</span> <span class="token operator">=&gt;</span>  <span class="token punctuation">{</span>
      <span class="token function">resolve</span><span class="token punctuation">(</span>parameter<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// reject 静态方法</span>
  <span class="token keyword">static</span> <span class="token function">reject</span> <span class="token punctuation">(</span><span class="token parameter">reason</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">reject</span><span class="token punctuation">(</span>reason<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">resolvePromise</span><span class="token punctuation">(</span><span class="token parameter">promise2<span class="token punctuation">,</span> x<span class="token punctuation">,</span> resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 如果相等了，说明return的是自己，抛出类型错误并返回</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>promise2 <span class="token operator">===</span> x<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">reject</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TypeError</span><span class="token punctuation">(</span><span class="token string">&#39;Chaining cycle detected for promise #&lt;Promise&gt;&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 判断x是不是 MyPromise 实例对象</span>
  <span class="token keyword">if</span><span class="token punctuation">(</span>x <span class="token keyword">instanceof</span> <span class="token class-name">MyPromise</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected</span>
    <span class="token comment">// x.then(value =&gt; resolve(value), reason =&gt; reject(reason))</span>
    <span class="token comment">// 简化之后</span>
    x<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolve<span class="token punctuation">,</span> reject<span class="token punctuation">)</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span><span class="token punctuation">{</span>
    <span class="token comment">// 普通值</span>
    <span class="token function">resolve</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

module<span class="token punctuation">.</span>exports <span class="token operator">=</span> MyPromise<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>`,90),k={href:"https://juejin.cn/post/6945319439772434469",target:"_blank",rel:"noopener noreferrer"},r={href:"https://www.bilibili.com/video/BV1V3411Y7d9?p=17&spm_id_from=pageDriver",target:"_blank",rel:"noopener noreferrer"};function d(v,m){const s=e("ExternalLinkIcon");return o(),c("div",null,[u,n("blockquote",null,[n("p",null,[n("a",k,[a("从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节 - 掘金"),t(s)])]),n("p",null,[n("a",r,[a("【前端】深入promise原理-蒋神带你手写promise_哔哩哔哩_bilibili"),t(s)])])])])}const y=p(i,[["render",d],["__file","promise.html.vue"]]);export{y as default};
