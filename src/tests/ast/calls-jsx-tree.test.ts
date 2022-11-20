import path from 'node:path';
import {
  printNode,
  Project,
  SourceFile,
  Node,
  ImportDeclaration,
  JsxClosingElement,
  JsxExpression,
  JsxOpeningElement,
  CallExpression,
  JsxSelfClosingElement,
  VariableDeclaration,
  SyntaxKind,
  KindToNodeMappingsWithCommentStatements,
  ts,
} from 'ts-morph';

const write = (...msg: unknown[]) => {
  process.stdout.write('---\n');
  msg.forEach((m) => process.stdout.write(`${m.toString()}\n`));
  process.stdout.write('---\n');
};

const isUppercase = (str: string) => str.toUpperCase() === str;

describe('calls & jsx tree', () => {
  it('foo', () => {
    const project = new Project({
      tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
    });

    const sfs = project.getSourceFiles();

    const isHookDeclaration = (varDec: VariableDeclaration) => {
      const name = varDec.getName();
      const initializer = varDec.getInitializer();

      const isHookName =
        name.length > 3 && name.startsWith('use') && isUppercase(name[3]);
      const isHookFn =
        !!initializer && initializer.isKind(SyntaxKind.ArrowFunction);

      return isHookName && isHookFn;
    };

    const isComponentDeclaration = (varDec: VariableDeclaration) => {
      const name = varDec.getName();
      const initializer = varDec.getInitializer();

      const isComponentName = isUppercase(name[0]);
      const isComponentFn =
        !!initializer && initializer.isKind(SyntaxKind.ArrowFunction);

      return isComponentName && isComponentFn;
    };

    type NodeTraverseFn<N extends Node> = (
      node: N,
      traverseHistory: MyNode[],
      treeContext: TreeContext,
      tree: CallRenderTree
    ) => unknown;

    const onSourceFile: NodeTraverseFn<SourceFile> = (
      sf,
      traverseHistory,
      treeContext,
      tree
    ) => {
      const name = sf.getFilePath().toString();
      const node = tree[name] ?? {
        name,
        type: 'file',
        declarations: {},
      };
      if (!tree[name]) {
        tree[name] = node;
      }
      treeContext.currentNode = node;
      traverseHistory.push(node);
    };

    const onImportDeclaration: NodeTraverseFn<ImportDeclaration> = (
      impDec: ImportDeclaration
    ) => null;

    const onVariableDeclaration: NodeTraverseFn<VariableDeclaration> = (
      varDec,
      traverseHistory,
      treeContext,
      tree
    ) => {
      const { currentNode } = treeContext;
      if (currentNode.type === 'tree') {
        return;
      }

      const isHook = isHookDeclaration(varDec);
      const isComponent = isComponentDeclaration(varDec);

      if (isHook) {
        const node: HookNode = {
          name: varDec.getName(),
          type: 'hook',
          declarations: {},
          calls: [],
        };
        currentNode.declarations[varDec.getName()] = node;
        treeContext.currentNode = node;
        traverseHistory.push(node);
      } else if (isComponent) {
        const node: ComponentNode = {
          name: varDec.getName(),
          type: 'component',
          declarations: {},
          calls: [],
          render: [],
        };
        currentNode.declarations[varDec.getName()] = node;
        treeContext.currentNode = node;
        traverseHistory.push(node);
      }
    };

    const onCallExpression: NodeTraverseFn<CallExpression> = (
      callExp,
      traverseHistory,
      treeContext,
      tree
    ) => {
      const { currentNode } = treeContext;

      if (currentNode.type === 'tree' || currentNode.type === 'file') {
        return;
      }

      currentNode.calls.push(callExp.getExpression().getText());
    };

    // const onReturnStatement: NodeTraverseFn<CallExpression> = (
    //   callExp,
    //   traverseHistory,
    //   treeContext,
    //   tree
    // ) => {};

    // const onRender = () => null;
    const onJSXExpression: NodeTraverseFn<JsxExpression> = (
      jsx,
      traverseHistory,
      treeContext,
      tree
    ) => {};

    const onJSXOpeningElement: NodeTraverseFn<JsxOpeningElement> = (
      jsx,
      traverseHistory,
      treeContext,
      tree
    ) => {
      const { currentNode, jsxContext } = treeContext;

      const name = jsx.getTagNameNode().getText();
      if (!isUppercase(name[0])) {
        return;
      }

      const node: RenderNode = {
        name,
        type: 'jsx',
        children: [],
      };

      const currentJsx =
        jsxContext.jsxHistory[jsxContext.jsxHistory.length - 1];

      if (currentJsx) {
        currentJsx.children.push(node);
      } else {
        if (
          currentNode.type === 'tree' ||
          currentNode.type === 'file' ||
          currentNode.type === 'hook'
        ) {
          return;
        }

        if (currentNode.type === 'component') {
          currentNode.render.push(node);
        } else if (currentNode.type === 'jsx') {
          currentNode.children.push(node);
        }
      }

      jsxContext.jsxHistory.push(node);
      traverseHistory.push(node);
    };

    const onJSXClosingElement: NodeTraverseFn<JsxClosingElement> = (
      jsx,
      traverseHistory,
      treeContext,
      tree
    ) => {
      const name = jsx.getTagNameNode().getText();
      if (!isUppercase(name[0])) {
        return;
      }

      treeContext.jsxContext.jsxHistory =
        treeContext.jsxContext.jsxHistory.slice(0, -1);
    };

    const onJSXSelfClosingElement: NodeTraverseFn<JsxSelfClosingElement> = (
      jsx,
      traverseHistory,
      treeContext,
      tree
    ) => {
      const { currentNode, jsxContext } = treeContext;

      const name = jsx.getTagNameNode().getText();
      if (!isUppercase(name[0])) {
        return;
      }

      const node: RenderNode = {
        name,
        type: 'jsx',
        children: [],
      };

      const currentJsx =
        jsxContext.jsxHistory[jsxContext.jsxHistory.length - 1];

      if (currentJsx) {
        currentJsx.children.push(node);
      } else {
        if (
          currentNode.type === 'tree' ||
          currentNode.type === 'file' ||
          currentNode.type === 'hook'
        ) {
          return;
        }

        if (currentNode.type === 'component') {
          currentNode.render.push(node);
        } else if (currentNode.type === 'jsx') {
          currentNode.children.push(node);
        }
      }
    };

    const nodeMapper: {
      [kind in SyntaxKind]?: NodeTraverseFn<
        KindToNodeMappingsWithCommentStatements[kind]
      >;
    } = {
      [SyntaxKind.SourceFile]: onSourceFile,
      [SyntaxKind.ImportDeclaration]: onImportDeclaration,
      [SyntaxKind.VariableDeclaration]: onVariableDeclaration,
      [SyntaxKind.CallExpression]: onCallExpression,
      // [SyntaxKind.ReturnStatement]: onCallExpression,
      // [SyntaxKind.JsxExpression]: onJSXExpression,
      [SyntaxKind.JsxOpeningElement]: onJSXOpeningElement,
      [SyntaxKind.JsxClosingElement]: onJSXClosingElement,
      [SyntaxKind.JsxSelfClosingElement]: onJSXSelfClosingElement,
    };

    const mainTree: CallRenderTree = { type: 'tree' };

    const traverseNode: NodeTraverseFn<Node> = (
      node,
      traverseHistory,
      treeContext,
      tree
    ) => {
      // write(node.getKindName(), printNode(node.compilerNode));

      nodeMapper[node.getKind()]?.(
        node as any,
        traverseHistory,
        treeContext,
        tree
      );
      // console.log(node.getKind(), !!nodeMapper[node.getKind()]);

      node.forEachChild((child) =>
        traverseNode(child, [...traverseHistory], { ...treeContext }, tree)
      );
    };

    sfs.forEach((sf) =>
      traverseNode(
        sf,
        [],
        {
          currentNode: mainTree,
          jsxContext: { jsxHistory: [] },
        },
        mainTree
      )
    );

    console.log('main', JSON.stringify(mainTree, undefined, 2));

    type TreeContext = {
      currentNode: MyNode;
      jsxContext: {
        jsxHistory: RenderNode[];
      };
    };

    type MyNode = CallRenderTree | DeclarationNode | RenderNode;

    type RenderNode = {
      name: string;
      type: 'jsx';
      children: RenderNode[];
    };

    type ComponentNode = {
      name: string;
      type: 'component';
      declarations: DeclarationMap;
      calls: string[];
      render: RenderNode[];
    };

    type HookNode = {
      name: string;
      type: 'hook';
      declarations: DeclarationMap;
      calls: string[];
    };

    type FileNode = {
      name: string;
      type: 'file';
      declarations: DeclarationMap;
    };

    type DeclarationNode = FileNode | ComponentNode | HookNode;

    type DeclarationMap = {
      [variableName in string]?: DeclarationNode;
    };

    type CallRenderTree = {
      type: 'tree';
    } & {
      [filePath in string]?: FileNode;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const expectedData: CallRenderTree = {
      type: 'tree',
      '/workspace/src/tests/ast/calls-jsx-tree.tsx': {
        name: '/workspace/src/tests/ast/calls-jsx-tree.tsx',
        type: 'file',
        declarations: {
          useAction: {
            name: 'useAction',
            type: 'hook',
            declarations: {},
            calls: ['useSecond'],
          },
          App: {
            name: 'App',
            type: 'component',
            declarations: {},
            calls: ['useAction'],
            render: [
              {
                name: 'Parent',
                type: 'jsx',
                children: [
                  {
                    name: 'Parent',
                    type: 'jsx',
                    children: [
                      {
                        name: 'Child',
                        type: 'jsx',
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Child',
                type: 'jsx',
                children: [],
              },
            ],
          },
          useSecond: {
            name: 'useSecond',
            type: 'hook',
            declarations: {},
            calls: [],
          },
          Parent: {
            name: 'Parent',
            type: 'component',
            declarations: {},
            calls: [],
            render: [],
          },
          Child: {
            name: 'Child',
            type: 'component',
            declarations: {},
            calls: ['useSecond'],
            render: [],
          },
        },
      },
    };

    expect(mainTree).toEqual(expectedData);
  });
});
