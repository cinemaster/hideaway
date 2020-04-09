import { combineReducers } from 'redux';
import { hideawayMultilevelReducers } from './multilevel';

export const hideawayAReducers = combineReducers({
  multilevel: hideawayMultilevelReducers,
});
