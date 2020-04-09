import { combineReducers } from 'redux';
import { hideawayIsReducers } from './is';

export const hideawayItReducers = combineReducers({
  is: hideawayIsReducers,
});
