import { TFHideawayReducer } from 'redux/middleware/contracts';

type TSimpleHideaway = string;

export const testSimpleReducer: TFHideawayReducer<TSimpleHideaway> = (
  state,
  action,
) => action.text || state;
