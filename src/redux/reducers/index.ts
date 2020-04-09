import { combineReducers } from 'redux';
import { simpleReducers } from './simple';
import { thunkReducers } from './thunk';

export const reducers = combineReducers({
  simple: simpleReducers,
  thunk: thunkReducers,
});
