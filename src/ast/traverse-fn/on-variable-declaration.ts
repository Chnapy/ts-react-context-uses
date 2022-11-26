import { SyntaxKind, VariableDeclaration } from 'ts-morph';
import { StringUtils } from '../../utils/string-utils';
import {
  ComponentNode,
  FnNode,
  TraverseFn,
  VariableNode,
} from '../traverse-fn';

const isFunctionDeclaration = (varDec: VariableDeclaration) => {
  const initializer = varDec.getInitializer();

  return !!initializer && initializer.isKind(SyntaxKind.ArrowFunction);
};

const isHookDeclaration = (varDec: VariableDeclaration) => {
  const name = varDec.getName();

  const isHookName =
    name.length > 3 &&
    name.startsWith('use') &&
    StringUtils.isUppercase(name[3]);
  const isHookFn = isFunctionDeclaration(varDec);

  return isHookName && isHookFn;
};

const isComponentDeclaration = (varDec: VariableDeclaration) => {
  const name = varDec.getName();

  const isComponentName = StringUtils.isUppercase(name[0]);
  const isComponentFn = isFunctionDeclaration(varDec);

  return isComponentName && isComponentFn;
};

export const onVariableDeclaration: TraverseFn<VariableDeclaration> = (
  varDec,
  treeContext
) => {
  const { currentNode } = treeContext;
  if (
    currentNode.type === 'tree' ||
    currentNode.type === 'jsx' ||
    currentNode.type === 'jsx-expression'
  ) {
    return;
  }

  const isFunction = isFunctionDeclaration(varDec);
  const isHook = isHookDeclaration(varDec);
  const isComponent = isComponentDeclaration(varDec);

  if (isHook) {
    const node: FnNode = {
      name: varDec.getName(),
      type: 'fn',
      hook: true,
      declarations: {},
      calls: [],
      render: [],
    };
    currentNode.declarations[node.name] = node;
    treeContext.currentNode = node;
  } else if (isComponent) {
    const node: ComponentNode = {
      name: varDec.getName(),
      type: 'component',
      declarations: {},
      calls: [],
      render: [],
    };
    currentNode.declarations[node.name] = node;
    treeContext.currentNode = node;
  } else if (isFunction) {
    const node: FnNode = {
      name: varDec.getName(),
      type: 'fn',
      hook: false,
      declarations: {},
      calls: [],
      render: [],
    };
    currentNode.declarations[node.name] = node;
    treeContext.currentNode = node;
  } else {
    const getNames = () => {
      const nameNode = varDec.getNameNode();
      if (nameNode.isKind(SyntaxKind.Identifier)) {
        return [nameNode.getText()];
      }

      if (nameNode.isKind(SyntaxKind.ArrayBindingPattern)) {
        return nameNode.getElements().flatMap((element) => {
          if (element.isKind(SyntaxKind.BindingElement)) {
            return [element.getName()];
          }

          console.log('not handled', element.getKindName());
          return [];
        });
      }

      console.log('not handled', nameNode.getKindName());
      return [];
    };

    const nodes = getNames().map(
      (name): VariableNode => ({
        name,
        type: 'variable',
        declarations: {},
        calls: [],
        render: [],
      })
    );

    nodes.forEach((node) => {
      currentNode.declarations[node.name] = node;
      treeContext.currentNode = node;
    });
  }
};
