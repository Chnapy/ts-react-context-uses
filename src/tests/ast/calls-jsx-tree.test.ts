import path from 'node:path';
import { Project, SourceFile } from 'ts-morph';
import { CallRenderTree, EveryNode } from './../../ast/traverse-fn';
import { traverseSourceFiles } from './../../ast/traverse-source-files';

describe('calls & jsx tree', () => {
  it('foo', () => {
    const project = new Project({
      tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
    });

    const sfs = project.getSourceFiles();

    const mainTree = traverseSourceFiles(sfs, project);

    console.log(
      JSON.stringify(
        mainTree,
        (key, value) => {
          if (value instanceof SourceFile) {
            return `[SourceFile] ${value.getFilePath()}`;
          }
          return value;
        },
        2
      )
    );

    const expectedFilenameMain = `${__dirname}/calls-jsx-tree.tsx`;

    const expectedFileNameSecond = `${__dirname}/foo.tsx`;

    const expectedData: CallRenderTree = {
      type: 'tree',
      body: {
        [expectedFilenameMain]: {
          name: expectedFilenameMain,
          type: 'file',
          declarations: {
            React: {
              name: 'React',
              type: 'import',
              importType: 'default',
              module: 'react',
              filePath: expect.stringContaining('/react/index.js'),
            },
            useContext: {
              name: 'useContext',
              type: 'import',
              importType: 'named',
              module: 'react',
              filePath: expect.stringContaining('/react/index.js'),
            },
            useEffect: {
              name: 'useEffect',
              type: 'import',
              importType: 'named',
              module: 'react',
              filePath: expect.stringContaining('/react/index.js'),
            },
            Foo: {
              name: 'Foo',
              type: 'import',
              importType: 'namespace',
              module: 'react',
              filePath: expect.stringContaining('/react/index.js'),
            },
            goo: {
              name: 'goo',
              type: 'import',
              importType: 'named',
              module: './foo',
              filePath: `${__dirname}/foo.tsx`,
            },
            extra: {
              name: 'extra',
              type: 'import',
              importType: 'named',
              module: 'foobar',
              filePath: path.join(__dirname, `../../../extra/index.ts`),
            },
            useAction: {
              name: 'useAction',
              type: 'fn',
              hook: true,
              declarations: {},
              calls: ['useSecond'],
              render: [],
            },
            App: {
              name: 'App',
              type: 'component',
              declarations: {
                foo: {
                  name: 'foo',
                  type: 'variable',
                  declarations: {},
                  calls: ['React.useState'],
                  render: [],
                },
                bar: {
                  name: 'bar',
                  type: 'variable',
                  declarations: {},
                  calls: ['useAction'],
                  render: [],
                },
                child: {
                  name: 'child',
                  type: 'variable',
                  declarations: {},
                  calls: [],
                  render: [
                    {
                      name: 'Child',
                      type: 'jsx',
                      children: [],
                    },
                  ],
                },
                childFn: {
                  name: 'childFn',
                  type: 'fn',
                  hook: false,
                  declarations: {},
                  calls: [],
                  render: [
                    {
                      name: 'Child',
                      type: 'jsx',
                      children: [],
                    },
                  ],
                },
              },
              calls: ['useEffect', 'console.log', 'childFn'],
              render: [
                {
                  name: 'FooProvider',
                  type: 'jsx',
                  children: [
                    {
                      type: 'jsx-expression',
                      calls: [],
                      variables: [],
                      children: [],
                    },
                    {
                      type: 'jsx-expression',
                      calls: [],
                      variables: ['bar'],
                      children: [],
                    },
                    {
                      type: 'jsx-expression',
                      calls: [],
                      variables: ['foo'],
                      children: [],
                    },
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
                      type: 'jsx-expression',
                      calls: [],
                      variables: ['child'],
                      children: [],
                    },
                  ],
                },
                {
                  type: 'jsx-expression',
                  calls: ['childFn'],
                  variables: [],
                  children: [],
                },
              ],
            },
            useFoo: {
              calls: ['React.useContext'],
              declarations: {},
              name: 'useFoo',
              type: 'fn',
              hook: true,
              render: [],
            },
            useFoo2: {
              calls: ['useContext'],
              declarations: {},
              name: 'useFoo2',
              type: 'fn',
              hook: true,
              render: [],
            },
            useSecond: {
              name: 'useSecond',
              type: 'fn',
              hook: true,
              declarations: {},
              calls: [],
              render: [],
            },
            FooContext: {
              calls: ['React.createContext'],
              declarations: {},
              name: 'FooContext',
              type: 'variable',
              render: [],
            },
            FooProvider: {
              calls: [],
              declarations: {},
              name: 'FooProvider',
              type: 'variable',
              render: [],
            },
            Parent: {
              name: 'Parent',
              type: 'component',
              declarations: {},
              calls: [],
              render: [
                {
                  type: 'jsx-expression',
                  calls: [],
                  variables: ['children'],
                  children: [],
                },
              ],
            },
            Child: {
              name: 'Child',
              type: 'component',
              declarations: {
                foo: {
                  name: 'foo',
                  type: 'variable',
                  calls: ['useFoo'],
                  declarations: {},
                  render: [],
                },
                foo2: {
                  name: 'foo2',
                  type: 'variable',
                  calls: ['useFoo2'],
                  declarations: {},
                  render: [],
                },
                value: {
                  name: 'value',
                  type: 'variable',
                  calls: ['useSecond'],
                  declarations: {},
                  render: [],
                },
              },
              calls: [],
              render: [
                {
                  type: 'jsx-expression',
                  calls: [],
                  variables: ['value'],
                  children: [],
                },
                {
                  type: 'jsx-expression',
                  calls: [],
                  variables: ['foo'],
                  children: [],
                },
                {
                  type: 'jsx-expression',
                  calls: [],
                  variables: ['foo2'],
                  children: [],
                },
              ],
            },
          },
        },
        [expectedFileNameSecond]: {
          name: expectedFileNameSecond,
          type: 'file',
          declarations: {
            goo: {
              name: 'goo',
              type: 'variable',
              calls: [],
              declarations: {},
              render: [],
            },
          },
        },
      },
    };

    expect(mainTree).toEqual(expectedData);

    // getDeclarationByName(string) => find closest declaration node => compute it if not already done
    //

    type GraphNode = {
      parents: Set<GraphNode>;
      children: Set<GraphNode>;
      rawNode: EveryNode;
    };

    const findDeclaration = (
      graphNode: GraphNode,
      nameSearching: string
    ): EveryNode | undefined => {
      const { rawNode, parents } = graphNode;

      const foundNode =
        'declarations' in rawNode && rawNode.declarations[nameSearching];
      if (foundNode) {
        if (nameSearching === 'Child') {
          // console.log('ENDUP HERE');
          console.log('FOUND', nameSearching, foundNode);
        }
        // console.log('FOUND', nameSearching, foundNode);
        return foundNode;
      }

      for (const parent of parents) {
        const node = findDeclaration(parent, nameSearching);
        if (node) {
          return node;
        }
      }
    };

    const toto = new Map<EveryNode, GraphNode>();

    const traverse = (node: EveryNode, newParent: GraphNode | null) => {
      const graphNode: GraphNode = toto.get(node) ?? {
        parents: new Set(),
        children: new Set(),
        rawNode: node,
      };
      if (newParent) {
        graphNode.parents.add(newParent);
        newParent.children.add(graphNode);
      }
      // if (toto.has(node)) {
      //   console.log('ALREADY HAS', node.name);
      // }
      toto.set(node, graphNode);

      switch (node.type) {
        case 'tree': {
          Object.values(node.body).forEach(
            (fileNode) => fileNode && traverse(fileNode, graphNode)
          );

          break;
        }
        case 'file': {
          Object.values(node.declarations).forEach(
            (decNode) => decNode && traverse(decNode, graphNode)
          );

          break;
        }
        case 'component':
        case 'fn':
        case 'variable': {
          Object.values(node.declarations).forEach(
            (decNode) => decNode && traverse(decNode, graphNode)
          );

          Object.values(node.render).forEach((nod) => traverse(nod, graphNode));

          node.calls.forEach((callStr) => {
            const callNode = findDeclaration(graphNode, callStr);
            if (callNode) {
              traverse(callNode, graphNode);
              // graphNode.children.add(callNode);
            }
          });

          break;
        }
        case 'jsx': {
          const callNode = findDeclaration(graphNode, node.name);
          if (callNode) {
            traverse(callNode, graphNode);
            // graphNode.children.add(callNode);
          }

          Object.values(node.children).forEach((nod) =>
            traverse(nod, graphNode)
          );

          break;
        }
        case 'jsx-expression': {
          Object.values(node.children).forEach((nod) =>
            traverse(nod, graphNode)
          );

          node.calls.forEach((callStr) => {
            const callNode = findDeclaration(graphNode, callStr);
            if (callNode) {
              traverse(callNode, graphNode);
              // graphNode.children.add(callNode);
            }
          });

          node.variables.forEach((varStr) => {
            const varNode = findDeclaration(graphNode, varStr);
            if (varNode) {
              traverse(varNode, graphNode);
              // graphNode.children.add(varNode);
            }
          });

          break;
        }
        case 'import': {
          break;
        }
      }
    };

    traverse(mainTree, null);

    const mainGraphNode = toto.get(mainTree)!;

    // console.log(mainGraphNode);
    const getNodeName = (node: EveryNode) =>
      `${'name' in node ? node.name : '-'} [${node.type}]`;

    const paths: string[] = [];

    const tooto = (item: GraphNode, nameList: string[]) => {
      nameList.push(getNodeName(item.rawNode));

      if (item.children.size === 0) {
        const pat = nameList.join('\n');
        paths.push(pat);
        // console.log(pat);
      }

      // console.log(
      //   first.rawNode.type,
      //   getNodeName(first.rawNode)
      // );

      [...item.children].forEach((gph) => tooto(gph, [...nameList]));
    };

    tooto(mainGraphNode, []);

    console.log('paths:', paths.length, 'unique:', new Set(paths).size);
  });
});
