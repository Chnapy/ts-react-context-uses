import { Project } from 'ts-morph';
import ts from 'typescript/lib/tsserverlibrary';

export const loadProjectFromPath = (path: string) => {
  const tsConfigFilePath = ts.findConfigFile(path, ts.sys.fileExists);
  if (!tsConfigFilePath) {
    return null;
  }

  const project = new Project({ tsConfigFilePath });

  return project;
};
