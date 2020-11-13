import { combineReducers } from 'redux';
import { ReducerStateManagement } from 'hideaway';

const titlesManagement = new ReducerStateManagement({
  initialState: null,
});

const titlesReducers = titlesManagement.combine({
  REQUEST_LIST: (_state, { payload }) =>
    payload.map((item) => `${item.title} (${item.release_date})`),
  CLEAN_LIST: () => null,
});

export const reducers = combineReducers({
  api: titlesReducers,
});
