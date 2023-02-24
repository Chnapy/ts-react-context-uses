import { ArrayUtils } from './../../utils/array-utils';
import { searchForDeclarations } from '../search-for-declarations';
import { StringUtils } from './../../utils/string-utils';
import { JsxOpeningElement } from 'ts-morph';
import { TraverseFn } from '../traverse-types';
import { traverse } from '../traverse';

export const onJSXOpeningElement: TraverseFn<JsxOpeningElement> = (
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
