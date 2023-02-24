import { ArrayUtils } from './../../utils/array-utils';
import { searchForDeclarations } from '../search-for-declarations';
import { TraverseFn } from '../traverse-types';
import { PropertyAccessExpression, SyntaxKind } from 'ts-morph';
import { traverse } from '../traverse';

export const onPropertyAccessExpression: TraverseFn<
  PropertyAccessExpression
> = (expr, context) => {
  const dec = ArrayUtils.first(
    searchForDeclarations(expr, expr.getExpression().getText())
  );

  if (dec) {
    if (expr.getName() === 'Provider') {
      const initializer = dec.getInitializer();

      if (initializer?.getText().includes('createContext')) {
        const contextName = dec.getName();

        context.contextProviders.set(
          expr.getParentIfKindOrThrow(SyntaxKind.VariableDeclaration).getName(),
          contextName
        );
      }
    }

    traverse(dec, context);
  }
};
