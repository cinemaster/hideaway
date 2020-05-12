import { hideaway } from 'hideaway';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { AppContainer } from './containers/App';
import { reducers } from './controllers/reducers';

const middleware = [hideaway(), thunk];
const enhancer = applyMiddleware(...middleware);
const store = createStore(reducers, {}, composeWithDevTools(enhancer));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
