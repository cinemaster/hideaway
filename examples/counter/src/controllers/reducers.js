import { combineReducers } from 'redux';
import { ReducerManagement } from 'hideaway';

const reducerManagement = new ReducerManagement({
  initialState: 0,
});

const counterReducers = reducerManagement.combine({
  INCREMENT: (state) => state + 1,
  DECREMENT: (state) => state - 1,
});

export const reducers = combineReducers({ counter: counterReducers });
