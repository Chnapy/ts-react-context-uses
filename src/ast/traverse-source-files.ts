import { traverseMapper } from './traverse-mapper';
import { Node, SourceFile } from 'ts-morph';
import { TraverseFn, TreeContext, CallRenderTree } from './traverse-fn';

const traverseNode: TraverseFn<Node> = (node, treeContext) => {
  // write(node.getKindName(), printNode(node.compilerNode));

  traverseMapper[node.getKind()]?.(node as any, treeContext);
  // console.log(node.getKind(), !!nodeMapper[node.getKind()]);

  node.forEachChild((child) => traverseNode(child, { ...treeContext }));
};

export const traverseSourceFiles = (
  sourceFiles: SourceFile[],
  project: TreeContext['project']
) => {
  const mainTree: CallRenderTree = { type: 'tree', body: {} };

  const treeContext: TreeContext = {
    currentNode: mainTree,
    jsxContext: { jsxHistory: [] },
    tree: mainTree,
    project,
    traverseNode,
  };

  sourceFiles.forEach((sf) => traverseNode(sf, treeContext));

  return mainTree;
};
