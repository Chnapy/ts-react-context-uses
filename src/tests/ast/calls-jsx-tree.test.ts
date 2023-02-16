import { CallRenderTree, EveryNode, ImportNode } from './../../ast/traverse-fn';
/* eslint-disable unicorn/consistent-destructuring */
import { loadProjectFromPath } from './../../ast/load-project-from-path';
import path from 'node:path';
import { Project, SourceFile } from 'ts-morph';
import { traverseSourceFiles } from './../../ast/traverse-source-files';

describe('calls & jsx tree', () => {
  it('foo', () => {
    const mainProject = new Project({
      tsConfigFilePath: path.join(__dirname, 'tsconfig.json'),
    });

    const projects = [mainProject];

    const sfs = mainProject.getSourceFiles();

    const getSourceFile = (filePath: string) => {
      for (const project of projects) {
        const sf = project.getSourceFile(filePath);
        if (sf) {
          console.log('P1', filePath);
          return sf;
        }
      }

      const newProject = loadProjectFromPath(filePath);
      if (newProject) {
        projects.push(newProject);
        console.log('P2', filePath);
        return newProject.getSourceFile(filePath);
      }
    };

    const mainTree = traverseSourceFiles(sfs, getSourceFile);

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
              filePath: undefined,
            },
            useContext: {
              name: 'useContext',
              type: 'import',
              importType: 'named',
              module: 'react',
              filePath: undefined,
            },
            useEffect: {
              name: 'useEffect',
              type: 'import',
              importType: 'named',
              module: 'react',
              filePath: undefined,
            },
            Foo: {
              name: 'Foo',
              type: 'import',
              importType: 'namespace',
              module: 'react',
              filePath: undefined,
            },
            goo: {
              name: 'goo',
              type: 'import',
              importType: 'named',
              module: './foo',
              filePath: `${__dirname}/foo.tsx`,
            },
            useExtra: {
              name: 'useExtra',
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
              children: [
                {
                  type: 'call',
                  name: 'useSecond',
                  args: [],
                  children: [],
                },
              ],
            },
            App: {
              name: 'App',
              type: 'component',
              declarations: {
                foo: {
                  name: 'foo',
                  type: 'variable',
                  declarations: {},
                  children: [
                    {
                      type: 'call',
                      name: 'React.useState',
                      args: expect.any(Array) as string[],
                      children: [],
                    },
                  ],
                },
                bar: {
                  name: 'bar',
                  type: 'variable',
                  declarations: {},
                  children: [
                    {
                      type: 'call',
                      name: 'useAction',
                      args: [],
                      children: [],
                    },
                  ],
                },
                child: {
                  name: 'child',
                  type: 'variable',
                  declarations: {},
                  children: [
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
                  children: [
                    {
                      name: 'Child',
                      type: 'jsx',
                      children: [],
                    },
                  ],
                },
              },
              children: [
                {
                  type: 'call',
                  name: 'useEffect',
                  args: expect.any(Array) as string[],
                  children: [
                    {
                      type: 'call',
                      name: 'console.log',
                      args: ['foo'],
                      children: [],
                    },
                  ],
                },
                {
                  name: 'FooProvider',
                  type: 'jsx',
                  children: [
                    {
                      type: 'jsx-expression',
                      variables: [],
                      children: [],
                    },
                    {
                      type: 'jsx-expression',
                      variables: ['bar'],
                      children: [],
                    },
                    {
                      type: 'jsx-expression',
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
                      variables: ['child'],
                      children: [],
                    },
                  ],
                },
                {
                  type: 'jsx-expression',
                  variables: [],
                  children: [
                    {
                      type: 'call',
                      name: 'childFn',
                      args: [],
                      children: [],
                    },
                  ],
                },
                {
                  type: 'call',
                  name: 'childFn',
                  args: [],
                  children: [],
                },
              ],
            },
            useFoo: {
              declarations: {},
              name: 'useFoo',
              type: 'fn',
              hook: true,
              children: [
                {
                  type: 'call',
                  name: 'React.useContext',
                  args: ['FooContext'],
                  children: [],
                },
              ],
            },
            useFoo2: {
              declarations: {},
              name: 'useFoo2',
              type: 'fn',
              hook: true,
              children: [
                {
                  type: 'call',
                  name: 'useContext',
                  args: ['FooContext'],
                  children: [],
                },
              ],
            },
            useSecond: {
              name: 'useSecond',
              type: 'fn',
              hook: true,
              declarations: {},
              children: [],
            },
            FooContext: {
              declarations: {},
              name: 'FooContext',
              type: 'variable',
              children: [
                {
                  type: 'call',
                  name: 'React.createContext',
                  args: expect.any(Array) as string[],
                  children: [],
                },
              ],
            },
            FooProvider: {
              declarations: {},
              name: 'FooProvider',
              type: 'variable',
              children: [
                {
                  type: 'variable',
                  name: 'FooContext.Provider',
                  declarations: {},
                  children: [],
                },
              ],
            },
            Parent: {
              name: 'Parent',
              type: 'component',
              declarations: {},
              children: [
                {
                  type: 'jsx-expression',
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
                  declarations: {},
                  children: [
                    {
                      type: 'call',
                      name: 'useFoo',
                      args: [],
                      children: [],
                    },
                  ],
                },
                foo2: {
                  name: 'foo2',
                  type: 'variable',
                  declarations: {},
                  children: [
                    {
                      type: 'call',
                      name: 'useFoo2',
                      args: [],
                      children: [],
                    },
                  ],
                },
                value: {
                  name: 'value',
                  type: 'variable',
                  declarations: {},
                  children: [
                    {
                      type: 'call',
                      name: 'useSecond',
                      args: [],
                      children: [],
                    },
                  ],
                },
              },
              children: [
                {
                  type: 'call',
                  name: 'useExtra',
                  args: [],
                  children: [],
                },
                {
                  type: 'jsx-expression',
                  variables: ['value'],
                  children: [],
                },
                {
                  type: 'jsx-expression',
                  variables: ['foo'],
                  children: [],
                },
                {
                  type: 'jsx-expression',
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
              declarations: {},
              children: [],
            },
          },
        },
        '/home/chnapy/projects/eslint-plugin-react-context-uses/extra/index.ts':
          {
            name: '/home/chnapy/projects/eslint-plugin-react-context-uses/extra/index.ts',
            type: 'file',
            declarations: {
              useExtra: {
                name: 'useExtra',
                type: 'fn',
                hook: true,
                declarations: {},
                children: [],
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

      if (nameSearching.includes('.')) {
        // console.log(
        //   'TOTOTO',
        //   nameSearching,
        //   rawNode.type,
        //   findDeclaration(graphNode, nameSearching.split('.')[0])
        // );
        // eslint-disable-next-line unicorn/no-lonely-if
        if (findDeclaration(graphNode, nameSearching.split('.')[0])) {
          return findDeclaration(graphNode, nameSearching.split('.')[0]);
        }
      }

      const searchForNode = () => {
        const foundNode =
          'declarations' in rawNode && rawNode.declarations[nameSearching];
        if (foundNode) {
          if (nameSearching === 'FooProvider') {
            console.log('ENDUP HERE');
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

      const node = searchForNode();

      // if (node?.type === 'variable' && node.children[0]?.type === 'variable') {
      //   node = node.children[0];
      // }

      return node;
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
        // if (node.type === 'import' && node.name === 'useContext') {
        //   console.log('BABABA', newParent);
        // }
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
        case 'call': {
          const callNode = findDeclaration(graphNode, node.name);
          if (callNode) {
            traverse(callNode, graphNode);
            // if (callNode.name === 'useContext') {
            //   console.log('FOFOFOFO', callNode.type, graphNode.children);
            // }
            // graphNode.children.add(callNode);
          }

          Object.values(node.children).forEach((nod) =>
            traverse(nod, graphNode)
          );
          break;
        }
        case 'component':
        case 'fn':
        case 'variable': {
          const nameSplited = node.name.split('.');
          const isProvider = nameSplited[1] === 'Provider';

          // if (
          //   node.children.length > 0 &&
          //   node.children[0].type === 'variable'
          // ) {
          //   node = node.children[0];
          //   graphNode.rawNode = node;
          //   toto.set(node, graphNode);
          // }

          // if (isProvider) {
          //   const callNode = findDeclaration(graphNode, nameSplited[0]);
          //   if (callNode) {
          //     traverse(callNode, graphNode);
          //     // graphNode.children.add(callNode);
          //   }
          // }

          Object.values(node.declarations).forEach(
            (decNode) => decNode && traverse(decNode, graphNode)
          );

          Object.values(node.children).forEach((nod) =>
            traverse(nod, graphNode)
          );
          // }

          // node.calls.forEach((call) => {
          //   const callNode = findDeclaration(graphNode, call.fn);
          //   if (callNode) {
          //     traverse(callNode, graphNode);
          //     // if (callNode.name === 'useContext') {
          //     //   console.log('FOFOFOFO', callNode.type, graphNode.children);
          //     // }
          //     // graphNode.children.add(callNode);
          //   }
          // });

          break;
        }
        case 'jsx': {
          const callNode = findDeclaration(graphNode, node.name);
          if (node.name === 'FooProvider') {
            console.log('TUTU', callNode?.type, callNode?.name);
          }
          if (callNode) {
            traverse(callNode, graphNode);
            // toto.delete(node);
            // graphNode = [...graphNode.children][0] ?? graphNode;
            // toto.set(node, graphNode);
            // node = graphNode.rawNode;
            // toto.set(node, graphNode);
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

          // node.calls.forEach((call) => {
          //   const callNode = findDeclaration(graphNode, call.fn);
          //   if (callNode) {
          //     traverse(callNode, graphNode);
          //     // graphNode.children.add(callNode);
          //   }
          // });

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
          const referencedFile = node.filePath && mainTree.body[node.filePath];
          if (referencedFile) {
            traverse(referencedFile, graphNode);
          }

          break;
        }
      }
    };

    traverse(mainTree, null);

    const mainGraphNode = toto.get(mainTree)!;

    // console.log(mainGraphNode);

    // const paths: string[] = [];
    const graphPathList: GraphNode[][] = [];

    const tooto = (item: GraphNode, graphPath: GraphNode[]) => {
      graphPath.push(item);

      if (item.children.size === 0) {
        graphPathList.push(graphPath);
      }

      [...item.children].forEach((gph) => tooto(gph, [...graphPath]));
    };

    tooto(mainGraphNode, []);

    const graphsToStr = (graphs: GraphNode[][]) =>
      graphs.map((gp) => {
        const getNodeName = (node: EveryNode) =>
          `${'name' in node ? node.name : '-'} [${node.type}]`;

        return `${gp
          .map((child) => getNodeName(child.rawNode))
          .join('\n')}\n\n`;
      });

    const filtered = graphPathList.filter((gp) => {
      const mapped = gp.map((foo) => foo.rawNode);

      const hasNamedUseContext =
        mapped.some(
          (node) =>
            node.type === 'import' &&
            node.importType === 'named' &&
            node.module === 'react' &&
            node.name === 'useContext'
        ) &&
        mapped.some(
          (node2) => node2.type === 'call' && node2.name === 'useContext'
        ) &&
        mapped.some(
          (node2) =>
            node2.type === 'call' && node2.name.includes('createContext')
        );

      const reactName = mapped.find(
        (node): node is ImportNode =>
          node.type === 'import' &&
          node.importType !== 'named' &&
          node.module === 'react'
      )?.name;

      const hasDefaultUseContext =
        !!reactName &&
        mapped.some(
          (node2) =>
            node2.type === 'call' && node2.name === `${reactName}.useContext`
        ) &&
        mapped.some(
          (node2) =>
            node2.type === 'call' && node2.name.includes('createContext')
        );
      // mapped.some(
      //   (node) =>
      //     node.type === 'import' &&
      //     node.importType !== 'named' &&
      //     node.module === 'react' &&
      //     mapped.some(
      //       (node2) =>
      //         node2.type === 'fn' &&
      //         node2.children.some(
      //           (child) =>
      //             child.type === 'call' &&
      //             child.name === `${node.name}.useContext`
      //         )
      //     )
      // ) &&
      // mapped.some(
      //   (node2) => node2.type === 'call' && node2.name === node.name
      // );

      // TODO check context passed to useContext + use of corresponding provider

      return hasNamedUseContext || hasDefaultUseContext;
    });

    const otherFiltered = graphPathList.filter((list) =>
      list
        .map((totoo) => totoo.rawNode)
        .some((totoo) => totoo.type === 'jsx' && totoo.name === 'FooProvider')
    );

    console.log(...graphsToStr(graphPathList));

    // console.log('FOO', ...graphsToStr(filtered));

    console.log('FOO-2', ...graphsToStr(otherFiltered));

    console.log('paths:', graphPathList.length, 'filtered:', filtered.length);
  });
});
