import { IRootState } from '../../contracts/redux';
import { generateSelector } from '../middleware/selector';

export const getHideawaySelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['hideaway'],
    defaultValue: null,
  });
};

export const getHideawayStateSelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['hideawayState'],
    defaultValue: null,
  });
};

export const getHideawayMultilevelSelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['it', 'is', 'a', 'multilevel', 'simple'],
    defaultValue: null,
  });
};

export const getHideawayStateMultilevelSelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['it', 'is', 'a', 'multilevel', 'state'],
    defaultValue: null,
  });
};

export const getHideawayNestedMultilevelSelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['it', 'is', 'a', 'multilevel', 'nested'],
    defaultValue: null,
  });
};
