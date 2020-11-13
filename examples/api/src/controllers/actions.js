import { generateStateManagerAction } from 'hideaway';

export const getListAction = () =>
  generateStateManagerAction(
    'REQUEST_LIST',
    () => fetch('https://ghibliapi.herokuapp.com/films'),
    {},
  );

export const fetchErrorAction = () =>
  generateStateManagerAction('REQUEST_LIST', () => fetch('https://wrong'), {});

export const cleanListAction = () => ({
  // Use RESPONSE if it doesn't request the API
  type: 'CLEAN_LIST_RESPONSE',
});
