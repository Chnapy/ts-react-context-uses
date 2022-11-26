import { ArrayUtils } from './../../utils/array-utils';
import { JsxExpression, SyntaxKind } from 'ts-morph';
import { TraverseFn, RenderExpressionNode } from './../traverse-fn';

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

  const getCalls = () => {
    if (expr?.isKind(SyntaxKind.CallExpression)) {
      return [expr.getExpression().getText()];
    }

    return [];
  };

  const node: RenderExpressionNode = {
    type: 'jsx-expression',
    calls: getCalls(),
    variables: getVariables(),
    children: [],
  };

  const currentJsx = ArrayUtils.last(jsxContext.jsxHistory);

  if (currentJsx) {
    currentJsx.children.push(node);
  } else {
    if (currentNode.type === 'tree' || currentNode.type === 'file') {
      return;
    }

    switch (currentNode.type) {
      case 'fn':
      case 'variable':
      case 'component': {
        currentNode.render.push(node);

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
