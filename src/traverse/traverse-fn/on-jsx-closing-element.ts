import { StringUtils } from './../../utils/string-utils';
import { JsxClosingElement } from 'ts-morph';
import { TraverseFn } from '../traverse-types';

export const onJSXClosingElement: TraverseFn<JsxClosingElement> = (
  jsx,
  { contextProviders }
) => {
  const name = jsx.getTagNameNode().getText();
  if (!StringUtils.isUppercase(name[0])) {
    return;
  }

  contextProviders.delete(name);
};
