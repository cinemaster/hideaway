import {
  applyMiddleware,
  createStore,
  Reducer,
  Store,
  Middleware,
} from 'redux';
import thunk from 'redux-thunk';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension';

// Store needs to be requested by getStore()
let store: Store;

export const setStore = <R extends Reducer>(reducers: R) => {
  const middleware = [thunk] as Middleware[];
  store = createStore(
    reducers,
    {},
    composeWithDevTools(applyMiddleware(...middleware)),
  );
};

export const getStore = () => {
  if (!store) {
    console.error("Store wasn't initialized");
  }
  return store;
};
