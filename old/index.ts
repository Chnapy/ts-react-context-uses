import type { Rule } from 'eslint';
import { findVariable, ReferenceTracker } from 'eslint-utils';
import type {
  BaseCallExpression,
  CallExpression,
  Expression,
  Identifier,
  ImportSpecifier,
  SpreadElement,
} from 'estree';

export const meta: Rule.RuleModule['meta'] = {
  type: 'problem',
  messages: {
    emptyCatch: 'Empty catch block is not allowed.',
  },
};

export const create: Rule.RuleModule['create'] = (context) => {
  // - get argument (context)
  // - search for context.provider
  // console.log('FOO', context.getAncestors());
  const isReactFunctionUsed = (
    node: Identifier & Rule.NodeParentExtension,
    functionName: string
  ): BaseCallExpression['arguments'] | null => {
    // X.functionName()
    if (
      node.parent.type === 'MemberExpression' &&
      node.parent.parent.type === 'CallExpression' &&
      node.parent.object !== node &&
      node.parent.object.type === 'Identifier' &&
      node.name === functionName
    ) {
      const parent = node.parent;
      const parentObject = parent.object as Identifier;
      const greatParent = node.parent.parent;

      const isReactFunction = findVariable(
        context.getScope(),
        parentObject
      )?.defs.some(
        (def) =>
          def.parent?.type === 'ImportDeclaration' &&
          def.parent.source.value === 'react' &&
          // import X from 'react'
          ((def.node.type === 'ImportDefaultSpecifier' &&
            def.name.name === parentObject.name) ||
            // import * as X from 'react'
            (def.node.type === 'ImportNamespaceSpecifier' &&
              def.node.local.name === parentObject.name))
      );
      if (!isReactFunction) {
        return null;
      }

      return greatParent.arguments;
    }

    // functionName()
    if (node.parent.type === 'CallExpression') {
      const isReactFunction = findVariable(context.getScope(), node)?.defs.some(
        (def) =>
          def.parent?.type === 'ImportDeclaration' &&
          def.parent.source.value === 'react' &&
          def.node.type === 'ImportSpecifier' &&
          def.node.imported.name === functionName
      );
      if (!isReactFunction) {
        return null;
      }

      return node.parent.arguments;
    }

    return null;
  };

  return {
    onCodePathStart: (codePath, node) => {
      // console.log('onCodePathStart', codePath, node.type);
    },
    // onCodePathEnd: (codePath, node) => {
    //   console.log('onCodePathEnd', codePath, node.type);
    // },
    // onCodePathSegmentStart: (segment, node) => {
    //   console.log('onCodePathSegmentStart', segment, node.type);
    // },
    // onCodePathSegmentEnd: (segment, node) => {
    //   console.log('onCodePathSegmentEnd', segment, node.type);
    // },
    // onCodePathSegmentLoop: (fromSegment, toSegment, node) => {
    //   console.log('onCodePathSegmentLoop', fromSegment, toSegment, node.type);
    // },

    Identifier: (node) => {
      const [contextArg] = isReactFunctionUsed(node, 'useContext') ?? [];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!contextArg || contextArg.type !== 'Identifier') {
        return;
      }

      console.log(contextArg);

      // const toto = findVariable(context.getScope(), contextArg);
      // console.log('VARIABLE', toto?.name, toto?.defs[0].node);

      // const tracker = new ReferenceTracker(context.getScope());

      // const reports = tracker.iterateEsmReferences({
      //   [toto!.name]: {
      //     [ReferenceTracker.READ]: true,
      //   },
      // });

      // const values = [...reports];

      console.log(
        'NAME',
        node.name,

        context.getDeclaredVariables(
          (contextArg as Rule.NodeParentExtension).parent.parent
        )
      );
    },

    CallExpression: (node) => {},
    CatchClause(node) {},
    JSXElement: (node: Rule.Node) => {},

    'Program:exit': (nod) => {
      console.log(nod);
      const tracker = new ReferenceTracker(context.getScope());

      const reports = tracker.iterateEsmReferences({
        react: {
          [ReferenceTracker.READ]: true,
          useContext: {
            [ReferenceTracker.CALL]: true,
          },
        },
      });

      const values = [...reports];

      const importNodes: Set<ImportSpecifier> = new Set();
      const callNodes: Set<CallExpression> = new Set();

      values.forEach(({ node }) => {
        if (node.type === 'ImportDeclaration') {
          const impor = node.specifiers.find(
            (spec): spec is ImportSpecifier =>
              spec.type === 'ImportSpecifier' &&
              spec.imported.name === 'useContext'
          );
          if (impor) {
            importNodes.add(impor);
          }
        } else if (node.type === 'CallExpression') {
          callNodes.add(node);
        } else {
          throw new Error(`node type not handled ${node.type}`);
        }
      });

      //   console.log('IMPORTS', importNodes);
      //   console.log('CALLS', callNodes);

      //   console.log(values[0].node.specifiers);
    },
  };
};
