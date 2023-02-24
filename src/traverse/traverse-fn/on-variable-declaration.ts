import { SyntaxKind, VariableDeclaration } from 'ts-morph';
import { TraverseFn } from '../traverse-types';

export const onVariableDeclaration: TraverseFn<VariableDeclaration> = (
  declaration,
  context
) => {
  const initializer = declaration.getInitializer();

  return {
    skip: !!initializer?.isKind(SyntaxKind.ArrowFunction),
  };
};
