import { combineReducers } from 'redux';
import { hideawayAReducers } from './a';

export const hideawayIsReducers = combineReducers({
  a: hideawayAReducers,
});
