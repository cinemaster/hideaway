import { combineReducers } from 'redux';
import { simpleReducers } from './simple';
import { thunkReducers } from './thunk';
import { hideawayReducers } from './hideaway';
import { hideawayStateManagementReducers } from './hideaway-state';
import { hideawayItReducers } from './it';

export const reducers = combineReducers({
  simple: simpleReducers,
  thunk: thunkReducers,
  hideaway: hideawayReducers,
  hideawayState: hideawayStateManagementReducers,
  it: hideawayItReducers,
});
