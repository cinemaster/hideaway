import { getState } from 'hideaway';

export const getListState = (state) => {
  return getState(state, {
    path: ['api'],
  });
};
