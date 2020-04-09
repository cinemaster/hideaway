import { TReducer } from 'redux/middleware/contracts';

type TSimpleHideaway = string;

export const testSimpleReducer: TReducer<TSimpleHideaway> = (state, action) =>
  action.text || state;
