import { getValue } from 'hideaway';

export const getUrl = (state, comicId) => {
  // Alternative to get the result
  return getValue(state, {
    path: ['api2'],
    nested: {
      keys: { comicId: `comic-${comicId}` },
      path: ['page', 'comicId', 'url'],
    },
  });
};
