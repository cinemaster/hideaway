import { getValue } from 'hideaway';

export const getListState = (state) => {
  return getValue(state, {
    path: ['api'],
  });
};
