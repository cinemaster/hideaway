// To use globaly

import { IRootState } from 'contracts/redux';
import { AnyAction, applyMiddleware, createStore, Reducer, Store } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import { THideawayMiddleware } from './middleware/contracts';
import { hideaway } from './middleware/core';

type S = IRootState;
type A = AnyAction;

// eslint-disable-next-line import/no-mutable-exports
let store: Store<S, AnyAction>;

function setStore(reducer: Reducer) {
  const middleware = [
    hideaway() as THideawayMiddleware<S, A>,
    thunkMiddleware as ThunkMiddleware<S, A>,
  ];
  const enhancer = composeWithDevTools(applyMiddleware(...middleware));
  store = (createStore(reducer, {}, enhancer) as unknown) as Store<
    S,
    AnyAction
  >;
}

export { hideaway, store, setStore };
