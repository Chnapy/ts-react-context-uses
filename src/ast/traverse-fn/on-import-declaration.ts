import { ArrayUtils } from './../../utils/array-utils';
import { ImportDeclaration } from 'ts-morph';
import { TraverseFn, ImportNode } from './../traverse-fn';

const resolve = (path: string): string | undefined => {
  try {
    const resolvedPath = require.resolve(path);
    if (resolvedPath.includes('/node_modules/')) {
      return;
    }

    return resolvedPath;
  } catch {
    return undefined;
  }
};

export const onImportDeclaration: TraverseFn<ImportDeclaration> = (
  impDec,
  treeContext
) => {
  const { currentNode, getSourceFile, traverseNode } = treeContext;

  if (currentNode.type !== 'file') {
    return;
  }

  const clause = impDec.getImportClause();
  const namespaceImport = impDec.getNamespaceImport();
  const defaultImport = impDec.getDefaultImport();
  const namedImports = clause?.getNamedImports() ?? [];

  const module = impDec.getModuleSpecifierValue();
  const filePath =
    impDec.getModuleSpecifierSourceFile()?.getFilePath() ?? resolve(module);

  // TODO on project reference / monorepo
  // sourceFile is undefined and not accessible
  // should run whole process on related tsconfig (with cache)

  const sourceFile = filePath ? getSourceFile(filePath) : undefined;
  if (sourceFile) {
    traverseNode(sourceFile, treeContext);
  }

  const defaultImportNode: ImportNode | undefined = defaultImport && {
    name: defaultImport.getText(),
    type: 'import',
    importType: 'default',
    module,
    filePath,
  };

  const namespaceImportNode: ImportNode | undefined = namespaceImport && {
    name: namespaceImport.getText(),
    type: 'import',
    importType: 'namespace',
    module,
    filePath,
  };

  const namedImportNodes: ImportNode[] = namedImports.map((namedImport) => ({
    name: namedImport.getText(),
    type: 'import',
    importType: 'named',
    module,
    filePath,
  }));

  const importNodes = [
    namespaceImportNode,
    defaultImportNode,
    ...namedImportNodes,
  ].filter(ArrayUtils.filterNonNullable);

  importNodes.forEach((node) => {
    currentNode.declarations[node.name] = node;
  });
};
