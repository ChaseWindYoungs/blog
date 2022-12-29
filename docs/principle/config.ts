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
    text: "字符串",
    collapsible: true,
    children: [
      fullPath("promise"),
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
