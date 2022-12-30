import { getFullPath, DocPaths } from "../utils/path";

const fullPath = function (
  restPath: string,
  defaultPath: string = DocPaths.Principle
): string {
  return getFullPath(defaultPath, restPath);
};

const sideBarConfig = {};
const sideArr = [
  {
    text: "深入理解JS",
    collapsible: true,
    children: [
      fullPath("deep-js/promise"),
      fullPath("deep-js/inherit"),
      fullPath("deep-js/this"),
      fullPath("deep-js/judge-data-type"),
      fullPath("deep-js/prototype/index"),
    ],
  },
  {
    text: "Vue2原理",
    collapsible: true,
    children: [
      fullPath("vue2/defineProperty"),
      fullPath("vue2/life-cycle"),
      fullPath("vue2/scoped"),
      {
        text: "Vue2源码学习",
        collapsible: true,
        children: [
          fullPath("vue2/vue2-source/debug"),
          fullPath("vue2/vue2-source/responsive"),
          fullPath("vue2/vue2-source/template-compilation"),
          fullPath("vue2/vue2-source/initial-rendering"),
          fullPath("vue2/vue2-source/render-update"),
          fullPath("vue2/vue2-source/async-update"),
          fullPath("vue2/vue2-source/array-update"),
        ],
      },
    ],
  },
  {
    text: "代码手写",
    collapsible: true,
    children: [
      fullPath("write-by-hand/function's func"),
      fullPath("write-by-hand/clone"),
      fullPath("write-by-hand/throttle&debounce/index"),
    ],
  },
  // {
  //   text: "数组",
  //   collapsible: true,
  //   children: [fullPath("array/15")],
  // },
];
sideBarConfig[`/${DocPaths.Principle}/`] = sideArr;

export default sideBarConfig;
