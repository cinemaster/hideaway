import { combineReducers } from 'redux';
import { hideawaySimpleMultilevelReducers } from './simple';
import { hideawayStateMultilevelReducers } from './state';

export const hideawayMultilevelReducers = combineReducers({
  simple: hideawaySimpleMultilevelReducers,
  state: hideawayStateMultilevelReducers,
});
