import { Node } from 'ts-morph';

export type TraverseContext = {
  contextProviders: Map<string, string>;
  trace: Node[];
  closedTraces: Node[][];
  errors: {
    contextName: string;
    trace: Node[];
  }[];
};

export type TraverseFn<N extends Node> = (
  node: N,
  context: TraverseContext
) => void;
