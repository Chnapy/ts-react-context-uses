import { JsxSelfClosingElement } from 'ts-morph';
import { ArrayUtils } from './../../utils/array-utils';
import { StringUtils } from './../../utils/string-utils';
import { searchForDeclarations } from '../search-for-declarations';
import { traverse } from '../traverse';
import { TraverseFn } from '../traverse-types';

export const onJSXSelfClosingElement: TraverseFn<JsxSelfClosingElement> = (
  jsx,
  context
) => {
  const name = jsx.getTagNameNode().getText();
  if (!StringUtils.isUppercase(name[0])) {
    return;
  }

  const dec = ArrayUtils.first(searchForDeclarations(jsx, name));

  if (dec) {
    traverse(dec, context);
  }
};
