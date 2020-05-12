import { combineReducers } from 'redux';
import { ReducerManagement } from 'hideaway';

const titlesManagement = new ReducerManagement({
  initialState: null,
});

const titlesReducers = titlesManagement.combine({
  REQUEST_LIST: (state, { payload }) =>
    payload.map((item) => `${item.title} (${item.release_date})`),
  CLEAN_LIST: () => null,
});

export const reducers = combineReducers({
  api: titlesReducers,
});
