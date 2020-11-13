import { getState, getValue } from 'hideaway';

export const getUrl = (state, comicId) => {
  const result = getState(state, {
    path: ['hideaway'],
    nested: {
      keys: { comicId: `comic-${comicId}` },
      path: ['page', 'comicId'],
    },
  });
  return result.value.url;
  // Alternative to get the result
  // return getValue(state, {
  //   path: ['hideaway'],
  //   nested: {
  //     keys: { comicId: `comic-${comicId}` },
  //     path: ['page', 'comicId', 'value', 'url'],
  //   },
  // });
  //
  // OR
  //
  // const result = getValue(state, {
  //   path: ['hideaway'],
  //   nested: {
  //     keys: { comicId: `comic-${comicId}` },
  //     path: ['page', 'comicId'],
  //   },
  // });
  // return result.value.url;
};
