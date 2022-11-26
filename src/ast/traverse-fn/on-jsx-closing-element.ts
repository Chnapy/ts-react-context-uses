import { StringUtils } from './../../utils/string-utils';
import { JsxClosingElement } from 'ts-morph';
import { TraverseFn } from './../traverse-fn';

export const onJSXClosingElement: TraverseFn<JsxClosingElement> = (
  jsx,
  treeContext
) => {
  const name = jsx.getTagNameNode().getText();
  if (!StringUtils.isUppercase(name[0])) {
    return;
  }

  treeContext.jsxContext.jsxHistory = treeContext.jsxContext.jsxHistory.slice(
    0,
    -1
  );
};
