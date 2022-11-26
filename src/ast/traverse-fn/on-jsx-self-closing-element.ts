import { JsxSelfClosingElement } from 'ts-morph';
import { ArrayUtils } from './../../utils/array-utils';
import { StringUtils } from './../../utils/string-utils';
import { RenderNode, TraverseFn } from './../traverse-fn';

export const onJSXSelfClosingElement: TraverseFn<JsxSelfClosingElement> = (
  jsx,
  treeContext
) => {
  const { currentNode, jsxContext } = treeContext;

  const name = jsx.getTagNameNode().getText();
  if (!StringUtils.isUppercase(name[0])) {
    return;
  }

  // console.log('JSX', jsx.print(), currentNode.type);

  const node: RenderNode = {
    name,
    type: 'jsx',
    children: [],
  };

  const currentJsx = ArrayUtils.last(jsxContext.jsxHistory);

  if (currentJsx) {
    currentJsx.children.push(node);
  } else {
    if (currentNode.type === 'tree' || currentNode.type === 'file') {
      return;
    }

    switch (currentNode.type) {
      case 'fn':
      case 'variable':
      case 'component': {
        currentNode.render.push(node);

        break;
      }
      case 'jsx-expression':
      case 'jsx': {
        currentNode.children.push(node);

        break;
      }
      // No default
    }
  }
};
