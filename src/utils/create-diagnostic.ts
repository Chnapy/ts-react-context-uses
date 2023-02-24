import { Node } from 'ts-morph';
import { Diagnostic, DiagnosticCategory } from 'typescript/lib/tsserverlibrary';

export type CreateDiagnosticPayload = {
  contextName: string;
  errorNode: Node | null;
};

export const createDiagnostic = ({
  errorNode,
  contextName,
}: CreateDiagnosticPayload): Diagnostic => ({
  category: DiagnosticCategory.Error,
  code: 0,
  file: errorNode?.getSourceFile().compilerNode as never,
  start: errorNode?.getStart(),
  length: errorNode?.getText().length,
  messageText: `Context ${contextName} is used outside of a ${contextName}.Provider, by a React.useContext(${contextName}) or a ${contextName}.Consumer`,
});
