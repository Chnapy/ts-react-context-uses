import { CallExpression, SyntaxKind } from 'ts-morph';
import { ArrayUtils } from './../../utils/array-utils';
import { searchForDeclarations } from '../search-for-declarations';
import { traverse } from '../traverse';
import { TraverseFn } from '../traverse-types';

export const onCallExpression: TraverseFn<CallExpression> = (
  callExp,
  context
) => {
  const name = callExp.getExpression().getText();

  if (name.includes('useContext')) {
    const contextNames = new Set(context.contextProviders.values());

    const contextArg = ArrayUtils.first(callExp.getArguments())
      ?.asKindOrThrow(SyntaxKind.Identifier)
      .getText();

    if (contextArg && !contextNames.has(contextArg)) {
      context.errors.push({
        contextName: contextArg,
        trace: context.trace,
      });
      return;
    }
  }

  const dec = ArrayUtils.first(searchForDeclarations(callExp, name));

  if (dec) {
    traverse(dec, context);
  }
};
