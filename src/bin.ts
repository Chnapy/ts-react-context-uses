#!/usr/bin/env node

import path from 'node:path';
import ts from 'typescript/lib/tsserverlibrary';
import { main } from './main';

const [filePath, sourceVariableName] = ts.sys.args;
if (!filePath || !sourceVariableName) {
  throw new Error(
    'Args missing, you should give source file path and source variable name'
  );
}

const sourceFilePath = require.resolve(path.join(process.cwd(), filePath));

const tsConfigFilePath = ts.findConfigFile(sourceFilePath, ts.sys.fileExists);
if (!tsConfigFilePath) {
  throw new Error('TSConfig file not found');
}

const diagnostics = main(tsConfigFilePath, sourceFilePath, sourceVariableName);

process.stdout.write(
  ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => ts.sys.newLine,
  })
);

if (diagnostics.length > 0) {
  process.exit(1);
}
