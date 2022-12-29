# Promise

Promise基本原理

1、Promise 是一个类，在执行这个类的时候，会传入一个执行器，这个执行器会立即执行

2、Promise 有三个状态

`Pending 等待`

`Fulfilled 完成`

`Rejected 失败`

3、状态只能由 Pending --> Fulfilled， 或者 Pending --> Rejected ，并且一旦发生改变就不能修改

4、Promise中使用 resolve 和 reject 来改变状态

5、then方法中做的事儿就是状态的判断，

`如果状态是成功，调用成功的回调函数`

`如果状态是失败，调用失败的回调函数`

### 一、Promise核心逻辑的实现

1、新建 MyPromise 类，传入 执行器 executor

```jsx
class MyPromise {
    constructor (executor) {
        // exevutor 是一个执行器，会立即执行
        executor()
    }
}
```

 

2、executor 执行器传入 resolve 和 reject 方法

```jsx
class MyPromise {
    constructor(executor) {
        // exevutor 是一个执行器，会立即执行
        // 并传入resolve和reject方法
        // 为什么要用this去接，因为这是 MyPromise 内部的方法
        executor(this.resolve, this.reject)    
    }
    // 为什么 要用箭头函数？ 
    // 因为如果直接调用的话，普通函数的this会直接指向 window 或者 undefined
    // 用箭头函数就可以让this指向当前实例对象
    
    // 更改成功后的状态
    resolve = () => {}
    
    // 更改失败后的状态
    reject = () => {}
}
```

3、状态与结果的管理

```jsx
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    // 存储状态的变量，初始值是pending
    status = PENDING

    // 成功之后的值
    value = null

    // 失败之后的值
    reason = null

    // 更改成功后的状态
    resolve = (value) => {
        
        // 只有状态是等待，才能执行状态修改
        if(this.status === PENDING) {
            // 修改状态为成功
            this.status = FULFILLED
            // 保存成功之后的值
            this.value = value 
        }
        
    }
    reject = (reason) => {
        // 只有状态是等待，才能执行状态修改
        if(this.status === PENDING) {
            // 修改状态为成功
            this.status = REJECTED
            // 保存成功之后的值
            this.reason = reason 
        }
    }
}
```

4. then 的简单实现

```jsx
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    status=PENDING

    value = null
    reason = null
    resolve = (value) => {
        if(this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
        }
    }
    reject = (reason) => {
        if(this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
        }
    }
    then(onFulfilled, onRejected) {
        // 判断状态
        if(this.status === FULFILLED) {
            // 调用成功的回调函数，并且把值返回
            onFulfilled(this.value)
        } else if(this.status === REJECTED) {
            // 调用成功的回调函数，并且把原因返回
            onRejected(this.reason)
        }
    }
}

// 5、使用 module.exports 对外暴露 MyPromise 类
module.exports = MyPromise;
```

5、使用 module.exports 对外暴露 MyPromise 类

```jsx
module.exports = MyPromise;
```

test

```jsx
// Promise.resolve().then(() => {
//     console.log(0);
//     return Promise.resolve(4);
// }).then((res) => {
//     console.log(res)
// })

// Promise.resolve().then(() => {
//     console.log(1);
// }).then(() => {
//     console.log(2);
// }).then(() => {
//     console.log(3);
// }).then(() => {
//     console.log(5);
// }).then(() =>{
//     console.log(6);
// })

const MyPromise = require('./MyPromise1.js')
const promise = new MyPromise((resolve, reject) => {
    resolve('success')
    reject('err')
})

 promise.then(value => {
    console.log('resolve', value)
  }, reason => {
    console.log('reject', reason)
  })
```

### 二、在 Promise 类中加入异步逻辑

MyPromise 类

```jsx
 const PENDING = 'pending';
 const FULFILLED = 'fulfilled';
 const REJECTED = 'rejected';
 class MyPromise {
     constructor(executor) {
         executor(this.resolve, this.reject)
     }
     status=PENDING
 
     value = null
     reason = null
     resolve = (value) => {
         if(this.status === PENDING) {
             this.status = FULFILLED
             this.value = value
         }
     }
     reject = (reason) => {
         if(this.status === PENDING) {
             this.status = REJECTED
             this.reason = reason
         }
     }
     then(onFulfilled, onRejected) {
         // 判断状态
         if(this.status === FULFILLED) {
             // 调用成功的回调函数，并且把值返回
             onFulfilled(this.value)
         } else if(this.status === REJECTED) {
             // 调用成功的回调函数，并且把原因返回
             onRejected(this.reason)
         }
     }
 }
```

1、缓存成功与失败回调

```jsx
const PENDING = 'pending';
 const FULFILLED = 'fulfilled';
 const REJECTED = 'rejected';
 class MyPromise {
     constructor(executor) {
         executor(this.resolve, this.reject)
     }
     status=PENDING
 
     value = null
     reason = null
     // ======== new ==========
     // 存储 成功的回调函数
     onFulfilledCallback = null;

     // 存储 失败的回调函数
     onRejeectedCallback = null;

     resolve = (value) => {
         if(this.status === PENDING) {
             this.status = FULFILLED
             this.value = value
         }
     }
     reject = (reason) => {
         if(this.status === PENDING) {
             this.status = REJECTED
             this.reason = reason
         }
     }
     then(onFulfilled, onRejected) {
         // 判断状态
         if(this.status === FULFILLED) {
             // 调用成功的回调函数，并且把值返回
             onFulfilled(this.value)
         } else if(this.status === REJECTED) {
             // 调用成功的回调函数，并且把原因返回
             onRejected(this.reason)
         } 
     }
 }
```

2、then 方法中的 Pending 的处理

```jsx
const PENDING = 'pending';
 const FULFILLED = 'fulfilled';
 const REJECTED = 'rejected';
 class MyPromise {
     constructor(executor) {
         executor(this.resolve, this.reject)
     }
     status=PENDING
 
     value = null
     reason = null
     // 存储 成功的回调函数
     onFulfilledCallback = null;

     // 存储 失败的回调函数
     onRejeectedCallback = null;

     resolve = (value) => {
         if(this.status === PENDING) {
             this.status = FULFILLED
             this.value = value
         }
     }
     reject = (reason) => {
         if(this.status === PENDING) {
             this.status = REJECTED
             this.reason = reason
         }
     }
     then(onFulfilled, onRejected) {
         // 判断状态
         if(this.status === FULFILLED) {
             // 调用成功的回调函数，并且把值返回
             onFulfilled(this.value)
         } else if(this.status === REJECTED) {
             // 调用成功的回调函数，并且把原因返回
             onRejected(this.reason)
         } else if(this.status = PENDING) {
            // == new ==
            // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
            // 等到执行成功或者失败函数的时候再传递
            this.onFulfilledCallback = onFulfilled
            this.onRejeectedCallback = onFulfilled
        }
     }
 }
```

3、resolve 与 reject 中调用回调函数

```jsx
const PENDING = 'pending';
 const FULFILLED = 'fulfilled';
 const REJECTED = 'rejected';
 class MyPromise {
     constructor(executor) {
         executor(this.resolve, this.reject)
     }
     status=PENDING
 
     value = null
     reason = null
     // 存储 成功的回调函数
     onFulfilledCallback = null;

     // 存储 失败的回调函数
     onRejeectedCallback = null;

     resolve = (value) => {
         if(this.status === PENDING) {
             this.status = FULFILLED
             this.value = value
             // == new ==
             // 判断成功回调是否存在，如果存在，就调用
             this.onFulfilledCallback && this.onFulfilledCallback(value)
         }
     }
     reject = (reason) => {
         if(this.status === PENDING) {
             this.status = REJECTED
             this.reason = reason
             // == new ==
             // 判断失败回调是否存在，如果存在，就调用
             this.onRejeectedCallback && this.onRejeectedCallback(value)
         }
     }
     then(onFulfilled, onRejected) {
         // 判断状态
         if(this.status === FULFILLED) {
             // 调用成功的回调函数，并且把值返回
             onFulfilled(this.value)
         } else if(this.status === REJECTED) {
             // 调用成功的回调函数，并且把原因返回
             onRejected(this.reason)
         } else if(this.status = PENDING) {
            // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
            // 等到执行成功或者失败函数的时候再传递
            this.onFulfilledCallback = onFulfilled
            this.onRejeectedCallback = onFulfilled
        }
     }
 }
```

test

```jsx
const MyPromise = require('./MyPromise2.js')
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
})

promise.then(value => {
  console.log('resolve', value)
}, reason => {
  console.log('reject', reason)
})
```

### 三、实现 then 方法 多次调用 添加多个处理函数

- Promise 的 then 方法是可以被多次调用的，
- 如果有三个then的调用，如果是同步回调，那么直接返回当前的值就行，
- 如果是异步回调，那么保存的成功失败的回调，需要用不同的值来保存
- 因为都互不相同

1、在 MyPromise 中新增两个数组

```jsx
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    status=PENDING

    value = null
    reason = null
		// 存储 成功的回调函数
		// ============ new ============
		//  onFulfilledCallback = null;
		onFulfilledCallback = []
		// 存储 失败的回调函数
		//  onRejeectedCallback = null;
		onRejeectedCallback = []

    resolve = (value) => {
        if(this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            // == new ==
            // 判断成功回调是否存在，如果存在，就调用
            this.onFulfilledCallback && this.onFulfilledCallback(value)
        }
    }
    reject = (reason) => {
        if(this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            // == new ==
            // 判断失败回调是否存在，如果存在，就调用
            this.onRejeectedCallback && this.onRejeectedCallback(value)
        }
    }
    then(onFulfilled, onRejected) {
        // 判断状态
        if(this.status === FULFILLED) {
            // 调用成功的回调函数，并且把值返回
            onFulfilled(this.value)
        } else if(this.status === REJECTED) {
            // 调用成功的回调函数，并且把原因返回
            onRejected(this.reason)
        } else if(this.status = PENDING) {
		        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
		        // 等到执行成功或者失败函数的时候再传递
		        this.onFulfilledCallback = onFulfilled
		        this.onRejeectedCallback = onFulfilled
		    }
    }
}
```

2、回调函数存在数组中

```jsx
const PENDING = 'pending';
  const FULFILLED = 'fulfilled';
  const REJECTED = 'rejected';
  class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    status=PENDING

    value = null
    reason = null
    // 存储 成功的回调函数
    //  onFulfilledCallback = null;
     onFulfilledCallback = []
     // 存储 失败的回调函数
     onRejeectedCallback = null;
    onRejeectedCallback = []

    resolve = (value) => {
        if(this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            
            // 判断成功回调是否存在，如果存在，就调用
            this.onFulfilledCallback && this.onFulfilledCallback(value)
        }
    }
    reject = (reason) => {
        if(this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            // 判断失败回调是否存在，如果存在，就调用
            this.onRejeectedCallback && this.onRejeectedCallback(value)
        }
    }
    then(onFulfilled, onRejected) {
        // 判断状态
        if(this.status === FULFILLED) {
            // 调用成功的回调函数，并且把值返回
            onFulfilled(this.value)
        } else if(this.status === REJECTED) {
            // 调用成功的回调函数，并且把原因返回
            onRejected(this.reason)
        } else if(this.status = PENDING) {
            // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
            // 等到执行成功或者失败函数的时候再传递
            // == new ==
            this.onFulfilledCallback.push(onFulfilled)
            this.onRejeectedCallback.push(onFulfilled)
        }
    }
}
```

3、循环成功和失败的回调

```jsx
const PENDING = 'pending';
  const FULFILLED = 'fulfilled';
  const REJECTED = 'rejected';
  class MyPromise {
    constructor(executor) {
        executor(this.resolve, this.reject)
    }
    status=PENDING

    value = null
    reason = null
    // 存储 成功的回调函数
    // == new ==
    //  onFulfilledCallback = null;
    onFulfilledCallback = []
    // 存储 失败的回调函数
    //  onRejeectedCallback = null;
    onRejeectedCallback = []

    resolve = (value) => {
        if(this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            // 判断成功回调是否存在，如果存在，就调用
            // == new ==

            // resolve 里面将所有成功的回调拿出来执行
            // this.onFulfilledCallback && this.onFulfilledCallback(value)
            while(this.onFulfilledCallbacks.length) {
                // Array.shift() 取出数组的第一个元素，然后传入参数调用
                // shift不是纯函数，取出后，数组将失去该元素，直到数组为空
                this.onFulfilledCallback.shift()(value)
            }
        }
    }
    
    reject = (reason) => {
        if(this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            // 判断失败回调是否存在，如果存在，就调用
            // == new ==
            // reject 里面将所有失败的回调拿出来执行

            // this.onRejeectedCallback && this.onRejeectedCallback(value)
            while(this.onRejeectedCallback.length) {
                // Array.shift() 取出数组的第一个元素，然后传入参数调用
                // shift不是纯函数，取出后，数组将失去该元素，直到数组为空
                this.onRejeectedCallback.shift()(reason)
            }
        }
    }
    then(onFulfilled, onRejected) {
        // 判断状态
        if(this.status === FULFILLED) {
            // 调用成功的回调函数，并且把值返回
            onFulfilled(this.value)
        } else if(this.status === REJECTED) {
            // 调用成功的回调函数，并且把原因返回
            onRejected(this.reason)
        } else if(this.status = PENDING) {
            // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
            // 等到执行成功或者失败函数的时候再传递
            
            this.onFulfilledCallback.push(onFulfilled)
            this.onRejeectedCallback.push(onFulfilled)
        }
    }
}
```

test

```jsx
const MyPromise = require('./MyPromise3.js')
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 2000); 
})

promise.then(value => {
  console.log(1)
  console.log('resolve', value)
})
 
promise.then(value => {
  console.log(2)
  console.log('resolve', value)
})

promise.then(value => {
  console.log(3)
  console.log('resolve', value)
})

// 3
// resolve success
```

### 四、实现 then 方法 的链式调用

- then方法要链式调用的话，就需要返回一个Promise对象
- then方法里面 return 一个返回值，作为下一个 then方法的参数，
- 如果 return 一个 Promise对象，就需要判断它的状态

1、创建一个 MyPromise，并在后面 return 出去

```jsx
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  constructor(executor) {
      executor(this.resolve, this.reject)
  }
  status=PENDING

  value = null
  reason = null
  // 存储 成功的回调函数
  // == new ==
  //  onFulfilledCallback = null;
  onFulfilledCallback = []
  // 存储 失败的回调函数
  //  onRejeectedCallback = null;
  onRejeectedCallback = []

  resolve = (value) => {
      if(this.status === PENDING) {
          this.status = FULFILLED
          this.value = value
          // 判断成功回调是否存在，如果存在，就调用
          // == new ==

          // resolve 里面将所有成功的回调拿出来执行
          // this.onFulfilledCallback && this.onFulfilledCallback(value)
          while(this.onFulfilledCallbacks.length) {
              // Array.shift() 取出数组的第一个元素，然后传入参数调用
              // shift不是纯函数，取出后，数组将失去该元素，直到数组为空
              this.onFulfilledCallback.shift()(value)
          }
      }
  }
  
  reject = (reason) => {
      if(this.status === PENDING) {
          this.status = REJECTED
          this.reason = reason
          // 判断失败回调是否存在，如果存在，就调用
          // == new ==
          // reject 里面将所有失败的回调拿出来执行

          // this.onRejeectedCallback && this.onRejeectedCallback(value)
          while(this.onRejeectedCallback.length) {
              // Array.shift() 取出数组的第一个元素，然后传入参数调用
              // shift不是纯函数，取出后，数组将失去该元素，直到数组为空
              this.onRejeectedCallback.shift()(reason)
          }
      }
  }
  then(onFulfilled, onRejected) {
    // ==== 新增 ====
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      if (this.status === FULFILLED) {
        // 获取成功回调函数的执行结果
        const x = onFulfilled(this.value);
        // 传入 resolvePromise 集中处理
        resolvePromise(x, resolve, reject);
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    }) 
    
    return promise2;
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}
```

test

```jsx
const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  // 目前这里只处理同步的问题
  resolve('success')
})

function other () {
  return new MyPromise((resolve, reject) =>{
    resolve('other')
  })
}
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  return other()
}).then(value => {
  console.log(2)
  console.log('resolve', value)
})

```

### **五、then 方法链式调用识别 Promise 是否返回自己**

> 如果 then 方法返回的是自己的 Promise 对象，则会发生循环调用，这个时候程序会报错
> 

```jsx
const promise = new Promise((resolve, reject) => {
  resolve(100)
})
const p1 = promise.then(value => {
  console.log(value)
  return p1
})

输出
100
Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
```

在MyPromise 中实现

```jsx
function resolvePromise(promise2, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(x instanceof MyPromise) {
    x.then(resolve, reject)
  } else{
    resolve(x)
  }
}

resolvePromise(promise2, x, resolve, reject);
               ^
ReferenceError: Cannot access 'promise2' before initialization
```

为啥会报错呢？

从错误提示可以看出，我们必须要等 promise2 完成初始化。

这个时候我们就要用上宏微任务和事件循环的知识了，

这里就需要创建一个异步函数去等待 promise2 完成初始化，前面我们已经确认了创建微任务的技术方案 --> `queueMicrotask`

```jsx
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class MyPromise {
  constructor(executor) {
      executor(this.resolve, this.reject)
  }
  status=PENDING

  value = null
  reason = null
  // 存储 成功的回调函数
  // == new ==
  //  onFulfilledCallback = null;
  onFulfilledCallback = []
  // 存储 失败的回调函数
  //  onRejeectedCallback = null;
  onRejeectedCallback = []

  resolve = (value) => {
      if(this.status === PENDING) {
          this.status = FULFILLED
          this.value = value
          // 判断成功回调是否存在，如果存在，就调用
          // == new ==

          // resolve 里面将所有成功的回调拿出来执行
          // this.onFulfilledCallback && this.onFulfilledCallback(value)
          while(this.onFulfilledCallbacks.length) {
              // Array.shift() 取出数组的第一个元素，然后传入参数调用
              // shift不是纯函数，取出后，数组将失去该元素，直到数组为空
              this.onFulfilledCallback.shift()(value)
          }
      }
  }
  
  reject = (reason) => {
      if(this.status === PENDING) {
          this.status = REJECTED
          this.reason = reason
          // 判断失败回调是否存在，如果存在，就调用
          // == new ==
          // reject 里面将所有失败的回调拿出来执行

          // this.onRejeectedCallback && this.onRejeectedCallback(value)
          while(this.onRejeectedCallback.length) {
              // Array.shift() 取出数组的第一个元素，然后传入参数调用
              // shift不是纯函数，取出后，数组将失去该元素，直到数组为空
              this.onRejeectedCallback.shift()(reason)
          }
      }
  }
  then(onFulfilled, onRejected) {
    // ==== 新增 ====
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      // 这里的内容在执行器中，会立即执行
      if (this.status === FULFILLED) {
        // ==== 新增 ====
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        })  
      } else if (this.status === REJECTED) {
        onRejected(this.reason);
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
      }
    }) 
    
    return promise2;
}

function resolvePromise(x, resolve, reject) {
  // 判断x是不是 MyPromise 实例对象
  if(x instanceof MyPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject)
  } else{
    // 普通值
    resolve(x)
  }
}
```

test

```jsx
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
    resolve('success')
})
 
// 这个时候将promise定义一个p1，然后返回的时候返回p1这个promise
const p1 = promise.then(value => {
   console.log(1)
   console.log('resolve', value)
   return p1
})
 
// 运行的时候会走reject
p1.then(value => {
  console.log(2)
  console.log('resolve', value)
}, reason => {
  console.log(3)
  console.log(reason.message)
})

结果

1
resolve success
3
Chaining cycle detected for promise #<Promise>
```

### **六、捕获错误及 then 链式调用其他状态代码补充**

1、捕获执行器错误

> 捕获执行器中的代码，如果执行器中有代码错误，那么 Promise 的状态要变为失败
> 

```jsx
// MyPromise.js

constructor(executor){
  // ==== 新增 ====
  // executor 是一个执行器，进入会立即执行
  // 并传入resolve和reject方法
  try {
    executor(this.resolve, this.reject)
  } catch (error) {
    // 如果有错误，就直接执行 reject
    this.reject(error)
  }
}
```

test

```jsx
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
    // resolve('success')
    throw new Error('执行器错误')
})
 
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
}, reason => {
  console.log(2)
  console.log(reason.message)
})

2
执行器错误
```

2、then 执行的时错误捕获

```jsx
// MyPromise.js

then(onFulfilled, onRejected) {
  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
    // 判断状态
    if (this.status === FULFILLED) {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        // ==== 新增 ====
        try {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        }  
      })  
    } else if (this.status === REJECTED) {
      // 调用失败回调，并且把原因返回
      onRejected(this.reason);
    } else if (this.status === PENDING) {
      // 等待
      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.onFulfilledCallbacks.push(onFulfilled);
      this.onRejectedCallbacks.push(onRejected);
    }
  }) 
  
  return promise2;
}
```

test

```jsx
// test.js

const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
    resolve('success')
    // throw new Error('执行器错误')
 })
 
// 第一个then方法中的错误要在第二个then方法中捕获到
promise.then(value => {
  console.log(1)
  console.log('resolve', value)
  throw new Error('then error')
}, reason => {
  console.log(2)
  console.log(reason.message)
}).then(value => {
  console.log(3)
  console.log(value);
}, reason => {
  console.log(4)
  console.log(reason.message)
})

结果
1
resolve success
4
then error
```

### **七、参考 fulfilled 状态下的处理方式，对 rejected 和 pending 状态进行改造**

1. 增加异步状态下的链式调用
2. 增加回调函数执行结果的判断
3. 增加识别 Promise 是否返回自己
4. 增加错误捕获

```jsx
// MyPromise.js

then(onFulfilled, onRejected) {
  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
    // 判断状态
    if (this.status === FULFILLED) {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 获取成功回调函数的执行结果
          const x = onFulfilled(this.value);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        } 
      })  
    } else if (this.status === REJECTED) { 
      // ==== 新增 ====
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 调用失败回调，并且把原因返回
          const x = onRejected(this.reason);
          // 传入 resolvePromise 集中处理
          resolvePromise(promise2, x, resolve, reject);
        } catch (error) {
          reject(error)
        } 
      }) 
    } else if (this.status === PENDING) {
      // 等待
      // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
      // 等到执行成功失败函数的时候再传递
      this.onFulfilledCallbacks.push(() => {
        // ==== 新增 ====
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = onFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      });
      this.onRejectedCallbacks.push(() => {
        // ==== 新增 ====
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = onRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          } 
        }) 
      });
    }
  }) 
  
  return promise2;
}
```

### **八、then 中的参数变为可选**

上面我们处理 then 方法的时候都是默认传入 onFulfilled、onRejected 两个回调函数，

但是实际上原生 Promise 是可以选择参数的单传或者不传，都不会影响执行。

```jsx
// MyPromise.js

then(onFulfilled, onRejected) {
  // 如果不传，就使用默认函数
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};

  // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
  const promise2 = new MyPromise((resolve, reject) => {
  ......
}
```

test

resolve 之后

```jsx
const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  resolve('succ')
})
 
promise.then().then().then(value => console.log(value))

// 打印 succ
```

reject 之后

```jsx
const MyPromise = require('./MyPromise')
const promise = new MyPromise((resolve, reject) => {
  reject('err')
})
 
promise.then().then().then(value => console.log(value), reason => console.log(reason))

// 打印 err
```

### **九、实现 resolve 与 reject 的静态调用**

```jsx
// MyPromise.js

MyPromise {
  ......
  // resolve 静态方法
  static resolve (parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter;
    }

    // 转成常规方式
    return new MyPromise(resolve =>  {
      resolve(parameter);
    });
  }

  // reject 静态方法
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}
```

- 总结
    
    ```jsx
    // MyPromise.js
    
    // 先定义三个常量表示状态
    const PENDING = 'pending';
    const FULFILLED = 'fulfilled';
    const REJECTED = 'rejected';
    
    // 新建 MyPromise 类
    class MyPromise {
      constructor(executor){
        // executor 是一个执行器，进入会立即执行
        // 并传入resolve和reject方法
        try {
          executor(this.resolve, this.reject)
        } catch (error) {
          this.reject(error)
        }
      }
    
      // 储存状态的变量，初始值是 pending
      status = PENDING;
      // 成功之后的值
      value = null;
      // 失败之后的原因
      reason = null;
    
      // 存储成功回调函数
      onFulfilledCallbacks = [];
      // 存储失败回调函数
      onRejectedCallbacks = [];
    
      // 更改成功后的状态
      resolve = (value) => {
        // 只有状态是等待，才执行状态修改
        if (this.status === PENDING) {
          // 状态修改为成功
          this.status = FULFILLED;
          // 保存成功之后的值
          this.value = value;
          // resolve里面将所有成功的回调拿出来执行
          while (this.onFulfilledCallbacks.length) {
            // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
            this.onFulfilledCallbacks.shift()(value)
          }
        }
      }
    
      // 更改失败后的状态
      reject = (reason) => {
        // 只有状态是等待，才执行状态修改
        if (this.status === PENDING) {
          // 状态成功为失败
          this.status = REJECTED;
          // 保存失败后的原因
          this.reason = reason;
          // resolve里面将所有失败的回调拿出来执行
          while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()(reason)
          }
        }
      }
    
      then(onFulfilled, onRejected) {
        const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason};
    
        // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
        const promise2 = new MyPromise((resolve, reject) => {
          const fulfilledMicrotask = () =>  {
            // 创建一个微任务等待 promise2 完成初始化
            queueMicrotask(() => {
              try {
                // 获取成功回调函数的执行结果
                const x = realOnFulfilled(this.value);
                // 传入 resolvePromise 集中处理
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error)
              } 
            })  
          }
    
          const rejectedMicrotask = () => { 
            // 创建一个微任务等待 promise2 完成初始化
            queueMicrotask(() => {
              try {
                // 调用失败回调，并且把原因返回
                const x = realOnRejected(this.reason);
                // 传入 resolvePromise 集中处理
                resolvePromise(promise2, x, resolve, reject);
              } catch (error) {
                reject(error)
              } 
            }) 
          }
          // 判断状态
          if (this.status === FULFILLED) {
            fulfilledMicrotask() 
          } else if (this.status === REJECTED) { 
            rejectedMicrotask()
          } else if (this.status === PENDING) {
            // 等待
            // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
            // 等到执行成功失败函数的时候再传递
            this.onFulfilledCallbacks.push(fulfilledMicrotask);
            this.onRejectedCallbacks.push(rejectedMicrotask);
          }
        }) 
        
        return promise2;
      }
    
      // resolve 静态方法
      static resolve (parameter) {
        // 如果传入 MyPromise 就直接返回
        if (parameter instanceof MyPromise) {
          return parameter;
        }
    
        // 转成常规方式
        return new MyPromise(resolve =>  {
          resolve(parameter);
        });
      }
    
      // reject 静态方法
      static reject (reason) {
        return new MyPromise((resolve, reject) => {
          reject(reason);
        });
      }
    }
    
    function resolvePromise(promise2, x, resolve, reject) {
      // 如果相等了，说明return的是自己，抛出类型错误并返回
      if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
      }
      // 判断x是不是 MyPromise 实例对象
      if(x instanceof MyPromise) {
        // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
        // x.then(value => resolve(value), reason => reject(reason))
        // 简化之后
        x.then(resolve, reject)
      } else{
        // 普通值
        resolve(x)
      }
    }
    
    module.exports = MyPromise;
    ```

## 参考


[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节 - 掘金](https://juejin.cn/post/6945319439772434469)

[【前端】深入promise原理-蒋神带你手写promise_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1V3411Y7d9?p=17&spm_id_from=pageDriver)
