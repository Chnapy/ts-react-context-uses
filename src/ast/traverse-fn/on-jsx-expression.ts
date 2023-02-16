import { ArrayUtils } from './../../utils/array-utils';
import { JsxExpression, SyntaxKind } from 'ts-morph';
import { TraverseFn, RenderExpressionNode, CallNode } from './../traverse-fn';

export const onJSXExpression: TraverseFn<JsxExpression> = (
  jsx,
  treeContext
) => {
  const { currentNode, jsxContext } = treeContext;

  const expr = jsx.getExpression();

  const getVariables = () => {
    if (expr?.isKind(SyntaxKind.Identifier)) {
      return [expr.getText()];
    }

    return [];
  };

  const getCalls = (): CallNode[] => {
    if (expr?.isKind(SyntaxKind.CallExpression)) {
      return [
        {
          type: 'call',
          name: expr.getExpression().getText(),
          args: expr
            .getArguments()
            .map((arg) =>
              arg.isKind(SyntaxKind.Identifier)
                ? arg.getText()
                : `-ignored-${arg.getKindName()}`
            ),
          children: [],
        },
      ];
    }

    return [];
  };

  const node: RenderExpressionNode = {
    type: 'jsx-expression',
    // calls: getCalls(),
    variables: getVariables(),
    children: [...getCalls()],
  };

  const currentJsx = ArrayUtils.last(jsxContext.jsxHistory);

  if (currentJsx) {
    currentJsx.children.push(node);
  } else {
    if (currentNode.type === 'tree' || currentNode.type === 'file') {
      return;
    }

    switch (currentNode.type) {
      case 'call':
      case 'fn':
      case 'variable':
      case 'component': {
        currentNode.children.push(node);

        break;
      }
      case 'jsx-expression':
      case 'jsx': {
        currentNode.children.push(node);

        break;
      }
      // No default
    }
  }
};
