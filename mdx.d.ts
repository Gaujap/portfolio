// Lets TypeScript resolve `import("./foo.mdx")` in the write-up registry.
declare module "*.mdx" {
  import type { ComponentType } from "react";
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
