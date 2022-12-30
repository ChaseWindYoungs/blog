import { defineUserConfig, defaultTheme } from "vuepress";
import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { mediumZoomPlugin } from "@vuepress/plugin-medium-zoom";
import { getDirname, path } from "@vuepress/utils";
import principleConfig from "../principle/config";
const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
  base: "/blog/",
  lang: "zh-CN",
  title: "LeetCode-Book",
  // [https://v2.vuepress.vuejs.org/zh/reference/config.html#description]
  description: "积硅步 至千里",
  theme: defaultTheme({
    // Public 文件路径
    logo: "/images/hero.jpg",
    // 你也可以直接将它设置为一个 URL
    repo: "https://github.com/ChaseWindYoungs/leetcode-book",
    // 顶部导航
    navbar: [
      {
        text: "题解",
        link: "/subjects/string/3.html",
      },
      {
        text: "数据结构",
        link: "/dataStructure/",
      },
      {
        text: "阅读指南",
        link: "/guide/",
      },
    ],

    // 侧边栏导航
    sidebar: Object.assign({}, principleConfig),
    sidebarDepth: 0,
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
