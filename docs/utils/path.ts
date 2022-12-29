enum DocPaths {
  Principle = "principle",
}

const getFullPath = function (pathPrefix: string, restPath: string): string {
  return `/${pathPrefix}/${restPath}.md`;
};

export { getFullPath, DocPaths };
