import { PropertyAccessExpression } from 'ts-morph';
import { TraverseFn, VariableNode } from './../traverse-fn';

export const onPropertyAccessExpression: TraverseFn<
  PropertyAccessExpression
> = (expr, treeContext) => {
  const { currentNode } = treeContext;

  if (currentNode.type !== 'variable') {
    return;
  }

  const node: VariableNode = {
    type: 'variable',
    name: expr.getText(),
    declarations: {},
    children: [],
  };
  currentNode.children.push(node);
  treeContext.currentNode = node;
};
