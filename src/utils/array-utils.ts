export const ArrayUtils = {
  first: <I>(arr: I[]): I | undefined => arr[0],
  last: <I>(arr: I[]): I | undefined => arr[arr.length - 1],
  filterNonNullable: <I>(item: I): item is NonNullable<I> =>
    item !== undefined && item !== null,
};
