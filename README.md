# Hideaway Middleware [![build status](https://img.shields.io/travis/Ozahata/hideaway/master.svg?style=flat-square)](https://travis-ci.org/Ozahata/hideaway) [![NPM](https://img.shields.io/npm/v/hideaway.svg)](https://www.npmjs.com/package/hideaway)

This middleware helps to standardize and reduce the code when you use stages (Request, Response, Error) or use redux with nested path.

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

- **Nested path call**: [Source](https://github.com/Ozahata/hideaway/tree/master/examples/nested) | [Sandbox](https://codesandbox.io/s/github/Ozahata/hideaway/tree/master/examples/nested)

- **Nested and API (without state manager)**: [Source](https://github.com/Ozahata/hideaway/tree/master/examples/api2) | [Sandbox](https://codesandbox.io/s/github/Ozahata/hideaway/tree/master/examples/api2)

- **Nested and API (with state manager)**: [Source](https://github.com/Ozahata/hideaway/tree/master/examples/hideaway) | [Sandbox](https://codesandbox.io/s/github/Ozahata/hideaway/tree/master/examples/hideaway)

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
});

const counterReducers = reducerManagement.combine({
  INCREMENT: (state) => state + 1,
  DECREMENT: (state) => state - 1,
});

export const reducers = combineReducers({ counter: counterReducers });
```

`selector.js`

```js
import { getValue } from 'hideaway';

export const getCounter = (state) => {
  return getValue(state, {
    path: ['counter'],
  });
};
```

#### API (use of redux-thunk)

`action.js`

```js
import { generateAction } from 'hideaway';

export const getScore = () =>
  generateStateManagerAction('FETCH_SCORE', () => fetch('http://<HOST>'));

// ...
```

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

`selector.js`

```js
import { getState } from 'hideaway';

export const getCounter = (state) => {
  return getState(state, {
    path: ['counter'],
  });
};
```

#### Combinations

Check the [examples](#examples) to see the variations.

## Documentation

### `hideaway`

The method enables to set the following settings:

| parameter           | description                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `onError`           | It calls when an error on API occurs. It receives the action with the response inside the payload. |
| `withExtraArgument` | Inject a custom argument to be on API calls.                                                       |

```js
const onError = (action) => console.log(action);
const secret = 42;

const store = createStore(
  reducer,
  applyMiddleware(hideaway({ onError, withExtraArgument: { secret } }), thunk),
);

// later
export const fetchUser = (id) =>
  generateAction('FETCH_USER', (dispatch, getState, extraArg) => {
    // API call
  }));
```

### `generateAction`

Format the action to be readable to the hideaway.

| parameter | description                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------ |
| `type`    | Property that indicates the type of action being performed                                             |
| `api`     | Function that returns a promise. The function receive (dispatch, getState, extra) from the middleware. |
| `options` | Additional settings (see the attributes below)                                                         |

#### options

| parameter        | description                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `apiPreReducer`  | It receives the body after the api call and expect a result that will send to the reducer.                                              |
| `keys`           | It is used to generate the nest path.                                                                                                   |
| `path`           | It is used with keys to generate the nested path. If the keys match with an item inside the path, the value of the key will replace it. |
| `allObject`      | It returns the object instead the value from the nested path.                                                                           |
| `complement`     | A complement for the action, to be used inside the reducer.                                                                             |
| `predicate`      | Skip the fetch if predicate is false.                                                                                                   |
| `onError`        | It calls when an error on API occurs. It receives the action with the response inside the payload.                                      |
| `isStateManager` | Define how to handle the api request. The default is false (It handles REQUEST, RESPONSE, ERROR).                                        |

```js
export const fetchUser = (id) =>
  generateAction('FETCH_USER', (dispatch, getState, extraArg) => {
    // API call
  }, {
    // options here
  }));
```

### `generateStateManagerAction`

Format the action to be readable to the hideaway and request to use the state manager feature.

| parameter | description                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------ |
| `type`    | Property that indicates the type of action being performed                                             |
| `api`     | Function that returns a promise. The function receive (dispatch, getState, extra) from the middleware. |
| `options` | Additional settings (see the attributes below)                                                         |

#### options

| parameter        | description                                                                                                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `apiPreReducer`  | It receives the body after the api call and expect a result that will send to the reducer.                                              |
| `keys`           | It is used to generate the nest path.                                                                                                   |
| `path`           | It is used with keys to generate the nested path. If the keys match with an item inside the path, the value of the key will replace it. |
| `allObject`      | It returns the object instead the value from the nested path.                                                                           |
| `complement`     | A complement for the action, to be used inside the reducer.                                                                             |
| `predicate`      | Skip the fetch if predicate is false.                                                                                                   |
| `onError`        | It calls when an error on API occurs. It receives the action with the response inside the payload.                                      |
| `isStateManager` | Define how to handle the api request. The default is true (It handles REQUEST, RESPONSE, ERROR).                                        |

```js
export const fetchUser = (id) =>
  generateStateManagerAction('FETCH_USER', (dispatch, getState, extraArg) => {
    // API call
  }, {
    // options here
  }));
```

### `ReducerManagement`

| parameter        | description                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `initialState`   | Sset an initial state for the reducer. For nested that doesn't set the nested, it will assing to a root key |
| `displayError`   | It display the error on console if the fetch fails.                                                         |
| `isNested`       | It enables nested path. (Default: false)                                                                    |
| `nested`         | Settings necessary if it sets isNested. (\*)                                                                |
| `isStateManager` | It enables the state manager for API use. (default: false)                                                                   |

(\*) The setting will use with `initialState` for the fist time only.

#### nested

| parameter | description                                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`    | It is used to generate the nest path.                                                                                                   |
| `path`    | It is used with keys to generate the nested path. If the keys match with an item inside the path, the value of the key will replace it. |


### `ReducerStateManagement`

| parameter        | description                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `initialState`   | Sset an initial state for the reducer. For nested that doesn't set the nested, it will assing to a root key |
| `displayError`   | It display the error on console if the fetch fails.                                                         |
| `isNested`       | It enables nested path. (Default: false)                                                                    |
| `nested`         | Settings necessary if it sets isNested. (\*)                                                                |
| `isStateManager` | It enables the state manager for API use. (default: true)                                                                  |

(\*) The setting will use with `initialState` for the fist time only.

#### nested

| parameter | description                                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`    | It is used to generate the nest path.                                                                                                   |
| `path`    | It is used with keys to generate the nested path. If the keys match with an item inside the path, the value of the key will replace it. |


### `getValue`

Retrieve the value from state

| parameter | description                                    |
| --------- | ---------------------------------------------- |
| `state`   | The state container                            |
| `options` | Additional settings (see the attributes below) |

#### options

| parameter        | description                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `path`           | It is used to find the initial path. (nested path is the complement)            |
| `defaultValue`   | Value to return if doesn't find the path or the value is null. (default: null)  |
| `nested`         | See [nested](#nested).                                                          |
| `isStateManager` | Inform to return the loading, value and error when the result is empty or null. (default: false) |

### `getState`

Retrieve the value from state using the state manager format

| parameter | description                                    |
| --------- | ---------------------------------------------- |
| `state`   | The state container                            |
| `options` | Additional settings (see the attributes below) |

#### options

| parameter        | description                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| `path`           | It is used to find the initial path. (nested path is the complement)            |
| `defaultValue`   | Value to return if doesn't find the path or the value is null. (default: null)  |
| `nested`         | See [nested](#nested).                                                          |
| `isStateManager` | Inform to return the loading, value and error when the result is empty or null. (default: true)|
