export const ArrayUtils = {
  first: <I>(arr: I[]) => ArrayUtils.getItem(arr, 0),
  last: <I>(arr: I[]) => ArrayUtils.getItem(arr, arr.length - 1),
  getItem: <I>(arr: I[], index: number): I | undefined => arr[index],
};
