import {
  THideawayAnyObject,
  TFHideawayPredicate,
} from 'redux/middleware/contracts';

export type THideawayState = string | object;

export interface IRootState {
  simple: string;
  thunk: object;
  hideaway: THideawayState;
  hideawayState: THideawayState;
}

export interface IApiOptions {
  error?: boolean;
  keys?: THideawayAnyObject;
  path?: string[];
  predicate?: TFHideawayPredicate;
}
