import { generateAction } from 'hideaway';

export const getListAction = () =>
  generateAction(
    'REQUEST_LIST',
    () => fetch('https://ghibliapi.herokuapp.com/films'),
    {},
  );

export const cleanListAction = () => ({
  // Use RESPONSE if it doesn't request the API
  type: 'CLEAN_LIST_RESPONSE',
});
