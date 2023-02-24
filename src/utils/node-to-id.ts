import { Node } from 'ts-morph';

export const nodeToId = (node: Node) => {
  const { line, column } = node
    .getSourceFile()
    .getLineAndColumnAtPos(node.getStart());

  return `${node.getKindName()} - ${line}:${column}`;
};
