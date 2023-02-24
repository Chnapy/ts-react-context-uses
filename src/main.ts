import {
  createDiagnostic,
  CreateDiagnosticPayload,
} from './utils/create-diagnostic';
import { ArrayUtils } from './utils/array-utils';
import { Node, Project } from 'ts-morph';
import { Diagnostic } from 'typescript/lib/tsserverlibrary';
import { searchForDeclarations } from './traverse/search-for-declarations';
import { traverse } from './traverse/traverse';
import { TraverseContext } from './traverse/traverse-types';

type NodeTrace = Node[];

type NodeTraceList = NodeTrace[];

const getErrorNode = (
  reversedErrorTrace: NodeTrace,
  nodeIndex: number,
  tracesWithOccurences: NodeTraceList
): Node | null => {
  const lastErrorTraceNode = reversedErrorTrace[0];

  const currentNode = ArrayUtils.getItem(reversedErrorTrace, nodeIndex);
  if (!currentNode) {
    return null;
  }

  const requiredNodes = [currentNode, lastErrorTraceNode];

  const tracesWithOccurencesFiltered = tracesWithOccurences.filter((trace) =>
    requiredNodes.every((node) => trace.includes(node))
  );

  if (tracesWithOccurencesFiltered.length > 0) {
    return getErrorNode(
      reversedErrorTrace,
      nodeIndex + 1,
      tracesWithOccurencesFiltered
    );
  }

  return currentNode;
};

export const main = (
  tsConfigFilePath: string,
  sourceFileName: string,
  sourceEntrypointName: string
): Diagnostic[] => {
  const mainProject = new Project({
    tsConfigFilePath,
  });

  const sourceFile = mainProject.getSourceFile(sourceFileName)!;

  const [declaration] = searchForDeclarations(
    sourceFile,
    sourceEntrypointName,
    'down'
  );

  const traverseContext: TraverseContext = {
    contextProviders: new Map(),
    trace: [],
    closedTraces: [],
    errors: [],
  };

  traverse(declaration, traverseContext);

  const closedTracesNormalized: NodeTraceList =
    traverseContext.closedTraces.map((trace) => trace);

  return traverseContext.errors
    .map(({ trace: errorTrace, contextName }): CreateDiagnosticPayload => {
      const reversedErrorTrace = [...errorTrace].reverse();

      const errorNode = getErrorNode(
        reversedErrorTrace,
        0,
        closedTracesNormalized
      );

      return { errorNode, contextName };
    })
    .filter(
      (payload, i, list) =>
        list.findIndex(({ errorNode }) => errorNode === payload.errorNode) === i
    )
    .map(createDiagnostic);
};
