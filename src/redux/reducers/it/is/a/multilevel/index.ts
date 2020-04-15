import { combineReducers } from 'redux';
import { hideawaySimpleMultilevelReducers } from './simple';
import { hideawayStateMultilevelReducers } from './state';
import { hideawayStateNestedReducers } from './nested';

export const hideawayMultilevelReducers = combineReducers({
  simple: hideawaySimpleMultilevelReducers,
  state: hideawayStateMultilevelReducers,
  nested: hideawayStateNestedReducers,
});
