# Hideaway Middleware [![build status](https://img.shields.io/travis/Ozahata/hideaway/master.svg?style=flat-square)](https://travis-ci.org/Ozahata/hideaway) [![NPM](https://img.shields.io/npm/v/hideaway.svg)](https://www.npmjs.com/package/hideaway)

This middleware helps to standardize and reduce the code when you use the stages (Request, Response, Error) or use redux with nested path.

## Installation

```bash
npm install hideaway
```

or

```bash
yarn add hideaway
```

## Why do I need this?

If you want to standardize the use redux and/or redux-thunk inside react with react-redux.

It is useful to work with calls to API and handling loading actions. (Require redux-thunk)

Work with nested path inside the reducer.

## Examples

This is an interactive version of the code that you can play with online.

- **Counter**: [Source](https://github.com/Ozahata/hideaway/tree/master/examples/counter) | [Sandbox](https://codesandbox.io/s/github/Ozahata/hideaway/tree/master/examples/counter)

- **API call**: [Source](https://github.com/Ozahata/hideaway/tree/master/examples/api) | [Sandbox](https://codesandbox.io/s/github/Ozahata/hideaway/tree/master/examples/api)

## Settings

### Store

Then, to enable hideaway, use
[`applyMiddleware()`](https://redux.js.org/api/applymiddleware):

```js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { hideaway } from 'hideaway';

const middleware = [hideaway(), thunk];
createStore(reducers, applyMiddleware(...middleware));
```

### Composition

#### Simple (without use of thunk)

`action.js`

```js
export const incrementAction = () => ({
  type: 'INCREMENT',
});

export const decrementAction = () => ({
  type: 'DECREMENT',
});
```

`reducer.js`

```js
import { combineReducers } from 'redux';
import { ReducerManagement } from 'hideaway';

const reducerManagement = new ReducerManagement({
  initialState: 0,
  isStateManager: false,
});

const counterReducers = reducerManagement.combine({
  INCREMENT: (state) => state + 1,
  DECREMENT: (state) => state - 1,
});

export const reducers = combineReducers({ counter: counterReducers });
```

`selector.js`

```js
import { generateSelector } from 'hideaway';

export const getCounter = (state) => {
  return generateSelector(state, {
    path: ['counter'],
  });
};
```

`App.js`

```js
// Other imports
import { getCounter } from "./selectors";

function App({ increment, decrement, state }) {
  const value = getCounter(state);
  return (
    // Component
  );
}

const mapDispatchToProps = {
  increment: incrementAction,
  decrement: decrementAction,
};

function mapStateToProps(state) {
  return { state };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

#### API (use of redux-thunk)

From the [simple](#simple-without-use-of-thunk) topic above, the change is inside the action only.

`action.js`

```js
import { generateAction } from 'hideaway';

export const getScore = () =>
  generateAction('FETCH_SCORE', () => fetch('http://<HOST>'));
```

##### Handling loading action

From the [simple](#simple-without-use-of-thunk) topic above, the change is the flag `isStateManager`.

By default, `ReducerManagement` has `isStateManager` as `true`.

`reducer.js`

```js
import { combineReducers } from 'redux';
import { ReducerManagement } from 'hideaway';

const reducerManagement = new ReducerManagement({
  initialState: 0,
  isStateManager: true,
});

const counterReducers = reducerManagement.combine({
  INCREMENT: (state) => state + 1,
  DECREMENT: (state) => state - 1,
});

export const reducers = combineReducers({ counter: counterReducers });
```

##### Nested tree

It is useful when you need to update different keys inside the object and cannot
use reducer.

`action.js`

```js
// For nested, it is necessary the keys and the path
export const incrementAction = () => ({
  type: 'INCREMENT',
  nested: {
    keys: { cluster: 'X', namespace: 'Y' },
    path: ['cluster', 'namespace'],
  },
});
```

`reducer.js`

```js
import { combineReducers } from 'redux';
import { ReducerManagement } from 'hideaway';

const reducerManagement = new ReducerManagement({
  isStateManager: false,
  isNested: true,
});

// For nested, it returns null if it doesn't find the value
const counterReducers = reducerManagement.combine({
  INCREMENT: (state) => (state || 0) + 1,
  DECREMENT: (state) => (state || 0) - 1,
});

export const reducers = combineReducers({ counter: counterReducers });
```

`selector.js`

```js
import { generateSelector } from 'hideaway';

export const getCounter = (state) => {
  return generateSelector(state, {
    path: ['cluster', 'namespace'],
  });
};
```
