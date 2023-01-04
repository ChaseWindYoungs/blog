import { defineUserConfig, defaultTheme } from "vuepress";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { mediumZoomPlugin } from "@vuepress/plugin-medium-zoom";
import { getDirname, path } from "@vuepress/utils";
import principleConfig from "../principle/config";
import webConfig from "../web/config";
const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
  base: "/blog/",
  lang: "zh-CN",
  title: "JavaScript Blog",
  // [https://v2.vuepress.vuejs.org/zh/reference/config.html#description]
  description: "积硅步 至千里",
  theme: defaultTheme({
    // Public 文件路径
    logo: "/images/hero.jpg",
    // 可以直接将它设置为一个 URL
    repo: "https://github.com/ChaseWindYoungs/blog",
    // 顶部导航
    navbar: [
      {
        text: "原理",
        link: "/principle/deep-js/promise",
      },
      {
        text: "Web体系",
        link: "/web/browser/cache",
      },
      {
        text: "JS算法书",
        link: "https://chasewindyoungs.github.io/leetcode-book/",
      },
      //   {
      //     text: "阅读指南",
      //     link: "/guide/",
      //   },
    ],

    // 侧边栏导航
    sidebar: Object.assign({}, principleConfig, webConfig),
    sidebarDepth: 0,
    editLink: false,
    lastUpdatedText: "上次更新",
    contributorsText: "作者",
  }),

  // https://v2.vuepress.vuejs.org/zh/reference/plugin/register-components.html
  plugins: [
    registerComponentsPlugin({
      // 配置项
      componentsDir: path.resolve(__dirname, "./components"),
    }),
    mediumZoomPlugin({
      // 配置项
    }),
  ],
});
