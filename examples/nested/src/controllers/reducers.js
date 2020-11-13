import { combineReducers } from 'redux';
import { ReducerManagement } from 'hideaway';

const booksManagement = new ReducerManagement({
  isNested: true,
});

const booksReducers = booksManagement.combine({
  UPDATE_BOOKS: (state, { payload }) => [...(state || []), payload],
  RESET_BOOKS: () => ({}),
});

export const reducers = combineReducers({
  nested: booksReducers,
});
