import { getValue } from 'hideaway';

export const getBooks = (state) => {
  return getValue(state, {
    path: ['nested'],
  });
};
