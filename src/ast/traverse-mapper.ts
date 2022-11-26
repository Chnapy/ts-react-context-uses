import { onImportDeclaration } from './traverse-fn/on-import-declaration';
import { onJSXExpression } from './traverse-fn/on-jsx-expression';
import { onJSXSelfClosingElement } from './traverse-fn/on-jsx-self-closing-element';
import { onJSXClosingElement } from './traverse-fn/on-jsx-closing-element';
import { onJSXOpeningElement } from './traverse-fn/on-jsx-opening-element';
import { onCallExpression } from './traverse-fn/on-call-expression';
import { onVariableDeclaration } from './traverse-fn/on-variable-declaration';
import { onSourceFile } from './traverse-fn/on-source-file';
import { TraverseFn } from './traverse-fn';
import { KindToNodeMappingsWithCommentStatements, SyntaxKind } from 'ts-morph';

export const traverseMapper: {
  [kind in SyntaxKind]?: TraverseFn<
    KindToNodeMappingsWithCommentStatements[kind]
  >;
} = {
  [SyntaxKind.SourceFile]: onSourceFile,
  [SyntaxKind.ImportDeclaration]: onImportDeclaration,
  [SyntaxKind.VariableDeclaration]: onVariableDeclaration,
  [SyntaxKind.CallExpression]: onCallExpression,
  // [SyntaxKind.ReturnStatement]: onCallExpression,
  [SyntaxKind.JsxExpression]: onJSXExpression,
  [SyntaxKind.JsxOpeningElement]: onJSXOpeningElement,
  [SyntaxKind.JsxClosingElement]: onJSXClosingElement,
  [SyntaxKind.JsxSelfClosingElement]: onJSXSelfClosingElement,
};
