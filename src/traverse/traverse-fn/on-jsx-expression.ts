import { ArrayUtils } from './../../utils/array-utils';
import { searchForDeclarations } from '../search-for-declarations';
import { JsxExpression, SyntaxKind } from 'ts-morph';
import { TraverseFn } from '../traverse-types';
import { traverse } from '../traverse';

export const onJSXExpression: TraverseFn<JsxExpression> = (jsx, context) => {
  const name = jsx.getExpression()?.getText();
  if (!name || jsx.getExpression()?.isKind(SyntaxKind.Identifier)) {
    return;
  }

  const dec = ArrayUtils.first(searchForDeclarations(jsx, name));

  if (dec) {
    traverse(dec, context);
  }
};
