import { onJSXClosingElement } from './traverse-fn/on-jsx-closing-element';
import { onPropertyAccessExpression } from './traverse-fn/on-property-access-expression';
import { onJSXSelfClosingElement } from './traverse-fn/on-jsx-self-closing-element';
import { onCallExpression } from './traverse-fn/on-call-expression';
import { onJSXExpression } from './traverse-fn/on-jsx-expression';
import { onJSXOpeningElement } from './traverse-fn/on-jsx-opening-element';
import { TraverseFn } from './traverse-types';
import {
  Node,
  KindToNodeMappingsWithCommentStatements,
  SyntaxKind,
} from 'ts-morph';

export const traverseMapper: {
  [kind in SyntaxKind]?: TraverseFn<
    KindToNodeMappingsWithCommentStatements[kind]
  >;
} = {
  [SyntaxKind.CallExpression]: onCallExpression,
  [SyntaxKind.JsxExpression]: onJSXExpression,
  [SyntaxKind.JsxOpeningElement]: onJSXOpeningElement,
  [SyntaxKind.JsxClosingElement]: onJSXClosingElement,
  [SyntaxKind.JsxSelfClosingElement]: onJSXSelfClosingElement,
  [SyntaxKind.PropertyAccessExpression]: onPropertyAccessExpression,
};

const variableDeclarationSyntaxKindsToIgnore: SyntaxKind[] = [
  SyntaxKind.ArrowFunction,
  SyntaxKind.FunctionDeclaration,
  SyntaxKind.JsxSelfClosingElement,
  SyntaxKind.JsxOpeningElement,
  SyntaxKind.JsxFragment,
];

const isVariableDeclarationIgnored = (node: Node): boolean =>
  node.isKind(SyntaxKind.VariableDeclaration) &&
  variableDeclarationSyntaxKindsToIgnore.some((kindToIgnore) =>
    node.getInitializer()?.isKind(kindToIgnore)
  );

export const traverse: TraverseFn<Node> = (node: Node, context) => {
  context = {
    ...context,
    trace: [...context.trace, node],
  };

  const nbrErrors = context.errors.length;

  traverseMapper[node.getKind()]?.(node as never, context);

  if (context.errors.length > nbrErrors) {
    return;
  }

  if (node.getChildren().length === 0) {
    context.closedTraces.push(context.trace);
  }

  node.forEachChild((child) => {
    if (!isVariableDeclarationIgnored(child)) {
      traverse(child, context);
    }
  });
};
