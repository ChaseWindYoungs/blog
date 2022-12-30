# 源码调试
1、vue gitHub 官网 下载源码<br />[https://github.com/vuejs/vue](https://github.com/vuejs/vue)<br />选择最新的分支tag<br />可以选择下载压缩包到本地，或者可以选择克隆git的分支<br />2、打开 vue/package.json 文件，<br />编辑 scripts 中的 `dev` 模式的命令，在 `scripts/config.js` 后 加上 `--sourcemap` 的命令
```json
"scripts": {
    "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
}
```
3、运行 npm run dev / yarn dev，在dist文件中生成最新的打包后文件<br />4、在项目中找个文件夹新建`index.html`将 vue.js 的文件按照路径引入
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="../dist/vue.js"></script>
  </head>
  <body>
    <div id='app'>
      <p> {{ message }} </p>
      <button @click="reverseMessage">反转消息</button>
    </div>
    <button></button>
  </body>
  <script>
    new Vue({
      el: "#app",
      data: {
        message: 'Hello Vue!'
      },
      methods: {
        test() {
          console.log()
        }
      }
    });
  </script>
</html>
```
5、在浏览器中，打开source，找到src文件夹，就是对应的源码，在想要了解的地方打断点调试即可<br />6、如果要在vue的源码中打印log，需要保存后重新执行 run dev
