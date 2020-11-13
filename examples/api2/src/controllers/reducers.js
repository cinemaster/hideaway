import { combineReducers } from 'redux';
import { ReducerManagement } from 'hideaway';

const mixManagement = new ReducerManagement({
  isNested: true,
});

const mixReducers = mixManagement.combine({
  REQUEST_LIST: (_state, action) => ({
    title: action.payload.title,
    url: action.payload.img,
    response: action,
  }),
  CLEAN_LIST: () => ({}),
});

export const reducers = combineReducers({
  api2: mixReducers,
});
