import { SourceFile } from 'ts-morph';
import { TraverseFn } from '../traverse-types';

export const onSourceFile: TraverseFn<SourceFile> = (sourceFile) => {
  console.log('SF', sourceFile.getFilePath());
};
