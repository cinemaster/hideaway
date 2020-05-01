import React from "react";
import ReactDOM from "react-dom";
import App from "./container";
import { Provider } from "react-redux";
import { hideaway } from "hideaway";
import { applyMiddleware, createStore } from "redux";
import { reducers } from "./controllers/reducers";
import { composeWithDevTools } from "redux-devtools-extension";

const middleware = [hideaway()];
const enhancer = applyMiddleware(...middleware);
const store = createStore(reducers, {}, composeWithDevTools(enhancer));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
