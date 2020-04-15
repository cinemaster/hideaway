import { IRootState } from 'contracts/redux';
import { AnyAction, applyMiddleware, createStore, Reducer, Store } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { hideaway } from './middleware/core';

// eslint-disable-next-line import/no-mutable-exports
let store: Store<IRootState, AnyAction>;

function setStore(reducer: Reducer) {
  const middleware = [hideaway(), thunkMiddleware];
  const enhancer = composeWithDevTools(applyMiddleware(...middleware));
  store = (createStore(reducer, {}, enhancer) as unknown) as Store<
    IRootState,
    AnyAction
  >;
}

export { hideaway, store, setStore };
