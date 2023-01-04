enum DocPaths {
  Principle = "principle",
  Vue = "vue",
  Web = "web",
}

const getFullPath = function (pathPrefix: string, restPath: string): string {
  return `/${pathPrefix}/${restPath}.md`;
};

export { getFullPath, DocPaths };
