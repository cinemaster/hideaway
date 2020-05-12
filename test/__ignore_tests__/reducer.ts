import { TFHideawayReducer } from '../../src/contracts';
import { TTestState } from './common';

export const testReducer: TFHideawayReducer<TTestState> = (state, action) =>
  action.text || state;
