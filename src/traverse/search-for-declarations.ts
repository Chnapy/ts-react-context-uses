import { Node, SyntaxKind, VariableDeclaration } from 'ts-morph';

export const searchForDeclarations = (
  baseNode: Node,
  searchName: string,
  direction: 'up' | 'down' = 'up'
): VariableDeclaration[] => {
  if (
    baseNode.isKind(SyntaxKind.VariableDeclaration) &&
    baseNode.getName() === searchName
  ) {
    return [baseNode];
  }

  const parent = baseNode.getParent();

  if (direction === 'up' && parent?.isKind(SyntaxKind.SourceFile)) {
    const nodes = parent.getChildren().filter((child) => child !== baseNode);

    return nodes.flatMap((node) =>
      searchForDeclarations(node, searchName, 'down')
    );
  }

  const nodes =
    direction === 'up'
      ? ([parent].filter(Boolean) as Node[])
      : baseNode.getChildren();

  const results = nodes.flatMap((node) =>
    searchForDeclarations(node, searchName, direction)
  );

  if (baseNode.isKind(SyntaxKind.VariableStatement) && direction === 'up') {
    return [...searchForDeclarations(baseNode, searchName, 'down'), ...results];
  }

  return results;
};
