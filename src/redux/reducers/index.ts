import { combineReducers } from 'redux';
import { simpleReducers } from './simple';

export const reducers = combineReducers({
  simple: simpleReducers,
});
