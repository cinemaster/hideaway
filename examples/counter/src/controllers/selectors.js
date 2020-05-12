import { getValue } from 'hideaway';

export const getCounter = (state) => {
  return getValue(state, {
    path: ['counter'],
    isStateManager: false,
  });
};
