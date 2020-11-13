import { generateAction, generateStateManagerAction } from 'hideaway';

export const fetchListAction = (comicId) =>
  generateStateManagerAction(
    'REQUEST_LIST',
    () =>
      fetch(
        `https://cors-anywhere.herokuapp.com/https://xkcd.com/${comicId}/info.0.json`,
      ),
    {
      keys: { comicId: `comic-${comicId}` },
      path: ['page', 'comicId'],
    },
  );

export const fetchErrorAction = (comicId) =>
  generateStateManagerAction('REQUEST_LIST', () => fetch('https://wrong'), {
    keys: { comicId: `comic-${comicId}` },
    path: ['page', 'comicId'],
  });

export const cleanListAction = () => ({
  // Use RESPONSE if it doesn't request the API
  type: 'CLEAN_LIST_RESPONSE',
  nested: {
    allObject: true,
  },
});
