import { Node, SourceFile } from 'ts-morph';

export type EveryNode = MyNode | ImportNode;

export type MyNode = CallRenderTree | DeclarationNode | RenderNode | CallNode;

export type CallNode = {
  name: string;
  type: 'call';
  args: string[];
  children: (RenderNode | CallNode)[];
};

export type RenderJsxNode = {
  name: string;
  type: 'jsx';
  children: (RenderNode | CallNode)[];
};

export type RenderExpressionNode = {
  type: 'jsx-expression';
  variables: string[];
  // calls: Call[];
  children: (RenderNode | CallNode)[];
};

export type RenderNode = RenderJsxNode | RenderExpressionNode;

export type ComponentNode = {
  name: string;
  type: 'component';
  declarations: DeclarationMap;
  // calls: Call[];
  children: (RenderNode | CallNode)[];
};

export type FnNode = {
  name: string;
  type: 'fn';
  hook: boolean;
  declarations: DeclarationMap;
  // calls: Call[];
  children: (RenderNode | CallNode)[];
};

export type VariableNode = {
  name: string;
  type: 'variable';
  declarations: DeclarationMap;
  // calls: Call[];
  children: (RenderNode | CallNode | VariableNode)[];
};

export type FileNode = {
  name: string;
  type: 'file';
  declarations: FileDeclarationMap;
};

export type DeclarationNode = FileNode | ComponentNode | FnNode | VariableNode;

export type ImportNode = {
  name: string;
  type: 'import';
  importType: 'default' | 'namespace' | 'named';
  module: string;
  filePath: string | undefined;
};

export type FileDeclarationMap = {
  [variableName in string]?: ImportNode | DeclarationNode;
};

export type DeclarationMap = {
  [variableName in string]?: DeclarationNode;
};

export type CallRenderTree = {
  type: 'tree';
  body: {
    [filePath in string]?: FileNode;
  };
};

export type TreeContext = {
  currentNode: MyNode;
  jsxContext: {
    jsxHistory: RenderNode[];
  };
  tree: CallRenderTree;
  traverseNode: TraverseFn<Node>;
  getSourceFile: (filePath: string) => SourceFile | undefined;
};

export type TraverseFn<N extends Node> = (
  node: N,
  treeContext: TreeContext
) => void;
