import { CallExpression, SyntaxKind } from 'ts-morph';
import { TraverseFn, CallNode } from './../traverse-fn';

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
  if (callExp.getExpression().getText().includes('useContext')) {
    console.log(
      'FOO',
      callExp
        .getArguments()
        .map((arg) => (arg.isKind(SyntaxKind.Identifier) ? arg.getText() : arg))
    );
  }
  const node: CallNode = {
    type: 'call',
    name: callExp.getExpression().getText(),
    args: callExp
      .getArguments()
      .map((arg) =>
        arg.isKind(SyntaxKind.Identifier)
          ? arg.getText()
          : `-ignored-${arg.getKindName()}`
      ),
    children: [],
  };
  currentNode.children.push(node);
  treeContext.currentNode = node;
};
