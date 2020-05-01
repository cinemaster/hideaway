import { generateSelector } from 'hideaway';

export const getListState = (state) => {
  return generateSelector(state, {
    path: ['titles'],
  });
};
