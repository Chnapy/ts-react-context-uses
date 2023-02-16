import { ArrayUtils } from './../../utils/array-utils';
import { StringUtils } from './../../utils/string-utils';
import { JsxOpeningElement } from 'ts-morph';
import { TraverseFn, RenderNode } from './../traverse-fn';

export const onJSXOpeningElement: TraverseFn<JsxOpeningElement> = (
  jsx,
  treeContext
) => {
  const { currentNode, jsxContext } = treeContext;

  const name = jsx.getTagNameNode().getText();
  if (!StringUtils.isUppercase(name[0])) {
    return;
  }

  const node: RenderNode = {
    name,
    type: 'jsx',
    children: [],
  };

  const currentJsx = ArrayUtils.last(jsxContext.jsxHistory);

  if (currentJsx) {
    currentJsx.children.push(node);
  } else {
    if (
      currentNode.type === 'tree' ||
      currentNode.type === 'file' ||
      currentNode.type === 'fn'
    ) {
      return;
    }

    if (currentNode.type === 'component') {
      currentNode.children.push(node);
    } else if (currentNode.type === 'jsx') {
      currentNode.children.push(node);
    }
  }

  jsxContext.jsxHistory.push(node);
};
