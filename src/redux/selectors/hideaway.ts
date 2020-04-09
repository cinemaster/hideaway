import { THideawayReduserState } from 'redux/middleware/contracts';
import { IRootState, THideawayState } from '../../contracts/redux';
import { generateSelector } from '../middleware/selector';

export const getHideawaySelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['hideaway'],
    defaultValue: null,
  }) as THideawayReduserState<THideawayState>;
};

export const getHideawayStateSelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['hideawayState'],
    defaultValue: null,
  }) as THideawayReduserState<THideawayState>;
};

export const getHideawayMultilevelSelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['it', 'is', 'a', 'multilevel', 'simple'],
    defaultValue: null,
  }) as THideawayReduserState<THideawayState>;
};

export const getHideawayStateMultilevelSelector = (state: IRootState) => {
  return generateSelector(state, {
    path: ['it', 'is', 'a', 'multilevel', 'state'],
    defaultValue: null,
  }) as THideawayReduserState<THideawayState>;
};
