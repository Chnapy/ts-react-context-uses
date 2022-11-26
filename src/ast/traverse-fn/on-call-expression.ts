import { CallExpression } from 'ts-morph';
import { TraverseFn } from './../traverse-fn';

export const onCallExpression: TraverseFn<CallExpression> = (
  callExp,
  treeContext
) => {
  const { currentNode } = treeContext;

  if (currentNode.type === 'tree' || currentNode.type === 'file') {
    return;
  }

  if (currentNode.type === 'jsx') {
    // TODO
    return;
  }

  currentNode.calls.push(callExp.getExpression().getText());
};
