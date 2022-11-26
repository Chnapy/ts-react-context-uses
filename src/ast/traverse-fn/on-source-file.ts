import { SourceFile } from 'ts-morph';
import { TraverseFn } from '../traverse-fn';

export const onSourceFile: TraverseFn<SourceFile> = (sf, treeContext) => {
  const treeBody = treeContext.tree.body;

  const name = sf.getFilePath().toString();
  const node = treeBody[name] ?? {
    name,
    type: 'file',
    declarations: {},
  };
  if (!treeBody[name]) {
    treeBody[name] = node;
  }
  treeContext.currentNode = node;
};
