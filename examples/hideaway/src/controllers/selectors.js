import { getValue } from 'hideaway';

export const getUrl = (state, comicId) => {
  // Alternative to get the result
  return getValue(state, {
    path: ['hideaway'],
    nested: {
      keys: { comicId: `comic-${comicId}` },
      path: ['page', 'comicId', 'value', 'url'],
    },
    isStateManager: false,
  });
  //
  // OR
  //
  // const value = getValue(state, {
  //   path: ['hideaway'],
  //   nested: {
  //     keys: { comicId: `comic-${comicId}` },
  //     path: ['page', 'comicId'],
  //   },
  // }).value;
  // return value ? value.url : null;
};
