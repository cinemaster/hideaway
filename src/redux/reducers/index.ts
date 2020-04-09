import { combineReducers } from 'redux';
import { simpleReducers } from './simple';
import { thunkReducers } from './thunk';
import { hideawayReducers } from './hideaway';
import { hideawayStateManagementReducers } from './hideaway-state-management';

export const reducers = combineReducers({
  simple: simpleReducers,
  thunk: thunkReducers,
  hideaway: hideawayReducers,
  hideawayState: hideawayStateManagementReducers,
});
