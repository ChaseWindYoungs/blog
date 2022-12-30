enum DocPaths {
  Principle = "principle",
  Vue = "vue",
}

const getFullPath = function (pathPrefix: string, restPath: string): string {
  return `/${pathPrefix}/${restPath}.md`;
};

export { getFullPath, DocPaths };
