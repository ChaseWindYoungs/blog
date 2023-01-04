import { getFullPath, DocPaths } from "../utils/path";

const fullPath = function (
  restPath: string,
  defaultPath: string = DocPaths.Web
): string {
  return getFullPath(defaultPath, restPath);
};

const sideBarConfig = {};
const sideArr = [
  {
    text: "浏览器",
    collapsible: true,
    children: [
      fullPath("browser/cache"),
    ],
  },
  // {
  //   text: "Vue2原理",
  //   collapsible: true,
  //   children: [
  //     fullPath("vue2/defineProperty"),
  //     fullPath("vue2/life-cycle"),
  //     fullPath("vue2/scoped"),
  //     {
  //       text: "Vue2源码学习",
  //       collapsible: true,
  //       children: [
  //         fullPath("vue2/vue2-source/debug"),
  //         fullPath("vue2/vue2-source/responsive"),
  //         fullPath("vue2/vue2-source/template-compilation"),
  //         fullPath("vue2/vue2-source/initial-rendering"),
  //         fullPath("vue2/vue2-source/render-update"),
  //         fullPath("vue2/vue2-source/async-update"),
  //         fullPath("vue2/vue2-source/array-update"),
  //       ],
  //     },
  //   ],
  // },
];
sideBarConfig[`/${DocPaths.Web}/`] = sideArr;

export default sideBarConfig;
