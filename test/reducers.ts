// @ts-nocheck
import { IHideawayNestedProps } from '../src/contracts';
import { createReducer, ReducerManagement } from '../src/reducer';
import { testSimpleReducer } from './__ignore_tests__/reducer';
import { identity } from 'ramda';
import _ from 'lodash';
import {
  hideConsoleError,
  restoreConsoleError,
} from './__ignore_tests__/common';

describe('middleware -> core -> reducer -> createReducer', () => {
  it('should return the initial state', () => {
    const initialState: string | null = 'Initial state';
    const reducer = createReducer(initialState, {});
    const result = reducer(undefined, { type: '' });
    expect(result).toBe('Initial state');
  });

  it('should return the action string state', () => {
    const initialState: string | null = 'Initial state';
    const expected = 'Action result';
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const result = reducer(undefined, { type: 'MOCK' });
    expect(result).toBe(expected);
  });

  it('should return the action number state', () => {
    const initialState: number | null = 1978;
    const expected = 1110;
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const result = reducer(undefined, { type: 'MOCK' });
    expect(result).toBe(expected);
  });

  it('should return the action list state', () => {
    const initialState: number[] | null = [];
    const expected = [1978];
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const result = reducer(undefined, { type: 'MOCK' });
    expect(result).toBe(expected);
  });

  it('should return the action object state', () => {
    const initialState: object | null = {};
    const expected = { year: 1978 };
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const result = reducer(undefined, { type: 'MOCK' });
    expect(result).toBe(expected);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> composeReducers', () => {
  it('should return the initial state for non state manager', () => {
    const initialState = 'Initial state';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
    });
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(result).toBe(initialState);
  });

  it('should return the initial state for state manager', () => {
    const initialState = 'Initial state';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: true,
    });
    const expected = {
      loading: false,
      value: initialState,
      error: null,
    };
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(result).toStrictEqual(expected);
  });

  it('should return the initial state with console error for nested without state manager and action with type only', () => {
    const initialState = 'Initial state';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
      isNested: true,
      nested: {
        keys: {},
        path: ['a'],
      },
    });
    const expected = {
      a: initialState,
    };
    const originalConsole = console.error;
    const consoleMock = jest.fn();
    console.error = consoleMock;

    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(consoleMock.mock.calls.length).toBe(1);
    console.error = originalConsole;

    expect(result).toStrictEqual(expected);
  });

  it('should return the initial state with console error for nested with state manager and action with type only', () => {
    const initialState = 'Initial state';
    const nested = {
      keys: {},
      path: ['a'],
    };
    const manager = new ReducerManagement({
      initialState,
      isStateManager: true,
      isNested: true,
      nested,
    });
    const expected = {
      a: {
        loading: false,
        value: initialState,
        error: null,
        nested,
      },
    };

    const originalConsole = console.error;
    const consoleMock = jest.fn();
    console.error = consoleMock;
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(consoleMock.mock.calls.length).toBe(1);
    console.error = originalConsole;
    expect(result).toStrictEqual(expected);
  });

  it('should return the value from a match', () => {
    const initialState = 'Initial state';
    const expected = 'result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
    });
    manager.add('MOCK', () => expected);
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK',
    });
    expect(result).toBe(expected);
  });

  it('should return a state manager', () => {
    const initialState = 'Initial state';
    const value = 'result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: true,
    });
    manager.add('MOCK', () => value);
    const result = manager.composeReducers()(
      {},
      {
        type: 'MOCK_RESPONSE',
        payload: value,
      },
    );
    expect(result.value).toBe(value);
  });

  it('should return a nested path', () => {
    const initialState = 'Initial state';
    const value = 'result';
    const nested = {
      keys: {},
      path: ['a'],
    };
    const manager = new ReducerManagement({
      initialState,
      isNested: true,
      isStateManager: false,
      nested,
    });
    manager.add('MOCK', () => value);
    const result = manager.composeReducers()(manager.initialState, {
      type: 'MOCK',
      nested,
    });
    expect(result.a).toBe(value);
  });

  it('should return a nested path with state manager', () => {
    const initialState = 'Initial state';
    const value = 'result';
    const nested = {
      keys: {},
      path: ['a'],
    };
    const manager = new ReducerManagement({
      initialState,
      isNested: true,
      isStateManager: true,
      nested,
    });
    manager.add('MOCK', () => value);
    const result = manager.composeReducers()(manager.initialState, {
      type: 'MOCK_RESPONSE',
      nested,
    });
    expect(result.a.value).toBe(value);
  });

  it('should return a nested path and joing previous nested object', () => {
    const initialState = 'Initial state';
    const value = 'result';
    const nested = {
      keys: {},
      path: ['a', 'c'],
    };
    const manager = new ReducerManagement({
      initialState,
      isNested: true,
      isStateManager: false,
      nested: {
        keys: {},
        path: ['a', 'b'],
      },
    });
    const expected = {
      a: {
        b: initialState,
        c: value,
      },
    };
    manager.add('MOCK', () => value);
    const result = manager.composeReducers()(manager.initialState, {
      type: 'MOCK',
      nested,
    });
    expect(result).toStrictEqual(expected);
  });

  it('should return an empty object with console error for isNested=true, isState=false and undefined state', () => {
    const initialState = 'Initial state';
    const value = {};

    const originalConsole = console.error;
    const consoleMock = jest.fn();
    console.error = consoleMock;

    const manager = new ReducerManagement({
      initialState,
      isNested: true,
      isStateManager: false,
    });
    manager.add('MOCK', (state) => state);
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    // contrutor and attribute nested
    expect(consoleMock.mock.calls.length).toBe(2);
    console.error = originalConsole;
    expect(result).toStrictEqual(value);
  });

  it('should return an empty object with console error for isNested=true, isState=true and undefined state', () => {
    const initialState = 'Initial state';
    const value = {};
    const originalConsole = console.error;
    const consoleMock = jest.fn();
    console.error = consoleMock;
    const manager = new ReducerManagement({
      initialState,
      isNested: true,
      isStateManager: true,
    });

    manager.add('MOCK', (state) => state);
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    // contrutor and attribute nested
    expect(consoleMock.mock.calls.length).toBe(2);
    console.error = originalConsole;
    expect(result).toStrictEqual(value);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> combine', () => {
  it('should compose with an internal action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
    });
    manager.add('MOCK', () => expected);
    const result = manager.combine()(undefined, { type: 'MOCK' });
    expect(result).toBe(expected);
  });

  it('should compose with an external action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
    });
    const result = manager.combine({
      SIMPLE_ACTION: testSimpleReducer,
    })(undefined, {
      type: 'SIMPLE_ACTION',
      text: expected,
    });
    expect(result).toBe(expected);
  });

  it('should compose with an initialization action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
      reducers: {
        SIMPLE_ACTION: testSimpleReducer,
      },
    });
    const result = manager.combine()(undefined, {
      type: 'SIMPLE_ACTION',
      text: expected,
    });
    expect(result).toBe(expected);
  });

  it('should compose with an initialization action with state manager', () => {
    const initialState = 'Initial state';
    const message = 'Action result';
    const expected = {
      loading: false,
      value: null,
      error: message,
    };
    const manager = new ReducerManagement({
      initialState,
      isStateManager: true,
      reducers: {
        SIMPLE_ACTION: testSimpleReducer,
      },
    });
    const result = manager.combine()(
      {},
      {
        type: 'SIMPLE_ACTION_ERROR',
        payload: message,
      },
    );
    expect(result).toStrictEqual(expected);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> compose', () => {
  it('should compose one reducer and return the initial state', () => {
    const initialState = 'Initial';
    const manager = new ReducerManagement();
    const composed = manager.compose(testSimpleReducer);
    const result = composed(initialState, { type: 'MOCK' });
    expect(result).toEqual(initialState);
  });

  it('should compose one reducer and return the action state', () => {
    const initialState = 'Initial';
    const expected = 'Action result';
    const manager = new ReducerManagement();
    const composed = manager.compose(testSimpleReducer);
    const result = composed(initialState, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });

  it('should compose two reducers and return the initial state', () => {
    const initialState = 'Initial';
    const manager = new ReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(initialState, { type: 'MOCK' });
    expect(result).toEqual(initialState);
  });

  it('should compose two reducers and return the action state', () => {
    const initialState = 'Initial';
    const expected = 'Action result';
    const manager = new ReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(initialState, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });

  it('should compose two reducers and return the MOCK state', () => {
    const text = 'MOCK';
    const manager = new ReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(text, { type: 'MOCK' });
    expect(result).toEqual(text);
  });

  it('should compose two reducers and return the action state', () => {
    const text = 'MOCK';
    const expected = 'Action result';
    const manager = new ReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(text, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> removeState', () => {
  it('should return the same text', () => {
    const text = 'MOCK';
    const manager = new ReducerManagement();
    const result = manager.removeState(text);
    expect(result).toEqual(text);
  });

  it('should remove the suffix', () => {
    const text = 'MOCK';
    const manager = new ReducerManagement();
    ['REQUEST', 'RESPONSE', 'ERROR'].map((item) => {
      const type = `${text}_${item}`;
      const result = manager.removeState(type);
      expect(result).toEqual(text);
    });
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> add', () => {
  it('should add a simple action', () => {
    const action = 'MOCK';
    const manager = new ReducerManagement({ isStateManager: false });
    manager.add(action, testSimpleReducer);
    expect(manager.reducers[action]).toEqual(testSimpleReducer);
  });

  it('should add a state manager action', () => {
    const action = 'MOCK';
    const manager = new ReducerManagement();
    const expected = manager.generateStatusReducer(action, testSimpleReducer);
    manager.add(action, testSimpleReducer);
    expect(manager.reducers[action].toString()).toBe(expected.toString());
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> generateStatusReducer', () => {
  it('should return loading as false for simple action', () => {
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as false for action RESPONSE', () => {
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as false for action ERROR', () => {
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: 'mock' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as true', () => {
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_REQUEST' });
    expect(result.loading).toBeTruthy();
  });

  it('should return the correct value from the reducer', () => {
    const expected = 'RESULT';
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE', text: expected });
    expect(result.value).toEqual(expected);
  });

  it('should return null for the error', () => {
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.error).toEqual(null);
  });

  it('should return a value for the error', () => {
    const expected = 'RESULT';
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    expect(result.error).toEqual(expected);
  });

  it('should display the error without console', () => {
    const originalConsole = hideConsoleError();
    const expected = new TypeError('RESULT');
    const manager = new ReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    restoreConsoleError(originalConsole);
    expect(result.error.toString()).toEqual(expected.toString());
  });

  it('should display the error on console', () => {
    const originalConsole = console.error;
    const consoleMock = jest.fn();
    console.error = consoleMock;
    const expected = new TypeError('RESULT');
    const manager = new ReducerManagement({ displayError: true });
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    console.error = originalConsole;
    expect(result.error.toString()).toEqual(expected.toString());
    expect(consoleMock.mock.calls.length).toBe(1);
  });

  it('should display empty key and path for nested', () => {
    const expected: IHideawayNestedProps = { keys: {}, path: [] };
    const originalConsole = hideConsoleError();
    const manager = new ReducerManagement({ isNested: true });
    restoreConsoleError(originalConsole);
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE' });
    expect(result.nested).toEqual(expected);
  });

  it('should display keys and path for nested', () => {
    const keys = { a: 1 };
    const path = [];
    const expected: IHideawayNestedProps = { keys, path };
    const originalConsole = hideConsoleError();
    const manager = new ReducerManagement({ isNested: true });
    restoreConsoleError(originalConsole);
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_REQUEST', nested: expected });
    expect(result.nested).toEqual(expected);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> createInitialState', () => {
  it('should return a string if isStateManager=false; isNested=false', () => {
    const isStateManager = false;
    const isNested = false;
    const expected = 'OK';
    const manager = new ReducerManagement();
    const result = manager.createInitialState(
      expected,
      isStateManager,
      isNested,
    );
    expect(result).toBe(expected);
  });

  it('should return the state manager if isStateManager=true; isNested=false', () => {
    const isStateManager = true;
    const isNested = false;
    const expected = null;
    const manager = new ReducerManagement();
    const result = manager.createInitialState(
      expected,
      isStateManager,
      isNested,
    );
    expect(result).toStrictEqual({
      loading: false,
      value: null,
      error: null,
    });
  });

  it('should return an empty object if isStateManager=false; isNested=true; nested=undefined', () => {
    const isStateManager = false;
    const isNested = true;
    const expected = null;
    const manager = new ReducerManagement();
    const originalConsole = hideConsoleError();
    const result = manager.createInitialState(
      expected,
      isStateManager,
      isNested,
    );
    restoreConsoleError(originalConsole);
    expect(_.isEmpty(result)).toBeTruthy();
    expect(_.isObject(result)).toBeTruthy();
  });

  it('should return the value if isStateManager=false; isNested=true; with nested', () => {
    const isStateManager = false;
    const isNested = true;
    const nested = { keys: {}, path: ['mock'] };
    const expected = null;
    const manager = new ReducerManagement();
    const result = manager.createInitialState(
      expected,
      isStateManager,
      isNested,
      nested,
    );
    expect(result).toStrictEqual({
      mock: expected,
    });
  });

  it('should return an empty object if isStateManager=true; isNested=true; nested=undefined', () => {
    const isStateManager = true;
    const isNested = true;
    const originalConsole = hideConsoleError();
    const manager = new ReducerManagement({
      isStateManager,
      isNested,
    });
    const result = manager.createInitialState(null, isStateManager, isNested);
    restoreConsoleError(originalConsole);
    expect(result).toStrictEqual({});
  });

  it('should return the value if isStateManager=true; isNested=true; with nested', () => {
    const isStateManager = true;
    const isNested = true;
    const nested = { keys: {}, path: ['mock'] };
    const originalConsole = hideConsoleError();
    const manager = new ReducerManagement({
      isStateManager,
      isNested,
    });
    const result = manager.createInitialState(
      null,
      isStateManager,
      isNested,
      nested,
    );
    restoreConsoleError(originalConsole);
    expect(result).toStrictEqual({
      mock: { loading: false, value: null, error: null, nested },
    });
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> getPathDifference', () => {
  const manager = new ReducerManagement();

  it('should return the object if the path is empty', () => {
    const obj = {};
    const path = [];
    const expected = obj;
    const result = manager.getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object if the value is null', () => {
    const obj = null; // null has typeof equal to object
    const path = [];
    const expected = obj;
    const result = manager.getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object if the path does not match', () => {
    const obj = { a: 1 };
    const path = ['one'];
    const expected = obj;
    const result = manager.getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object with the difference of the partial path', () => {
    const obj = { a: { b: { c: { key: 'd', e: true } } } };
    const path = ['a', 'b', 'f'];
    const expected = { c: { key: 'd', e: true } };
    const result = manager.getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the integer', () => {
    const obj = 1;
    const path = ['a', 'b', 'f'];
    const expected = obj;
    const result = manager.getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object with the difference of the path', () => {
    const obj = { a: { b: { c: { key: 'd', e: true } } } };
    const path = ['a', 'b', 'c'];
    const expected = { key: 'd', e: true };
    const result = manager.getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> getPathDifference', () => {
  const manager = new ReducerManagement();

  it('should return an empty path', () => {
    const nested: IHideawayNestedProps = {
      keys: {},
      path: [],
    };
    const expected = [];
    const result = manager.generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return an empty path (with keys)', () => {
    const nested: IHideawayNestedProps = {
      keys: { a: 1 },
      path: [],
    };
    const expected = [];
    const result = manager.generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return a path without keys', () => {
    const nested: IHideawayNestedProps = {
      keys: {},
      path: ['a'],
    };
    const expected = ['a'];
    const result = manager.generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return a path with keys', () => {
    const nested: IHideawayNestedProps = {
      keys: { a: 'mock' },
      path: ['a'],
    };
    const expected = ['mock'];
    const result = manager.generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return a path with missing key', () => {
    const nested: IHideawayNestedProps = {
      keys: { a: 'mock' },
      path: ['a', 'b'],
    };
    const expected = ['mock', 'b'];
    const result = manager.generatePath(nested);
    expect(result).toStrictEqual(expected);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> generateNested', () => {
  it('should return the previous state if the nested does not contain the key', () => {
    const expected = 'OK';
    const nested = {};
    const manager = new ReducerManagement();
    const originalConsole = hideConsoleError();
    const result = manager.generateNested(expected, nested, 'Hogue');
    restoreConsoleError(originalConsole);
    expect(result).toBe(expected);
  });

  it('should return the previous state if the nested does not contain the keys', () => {
    const expected = 'OK';
    const nested = { path: ['one'] };
    const manager = new ReducerManagement();
    const originalConsole = hideConsoleError();
    const result = manager.generateNested(expected, nested, 'Hogue');
    restoreConsoleError(originalConsole);
    expect(result).toBe(expected);
  });

  it('should return the previous state if the nested does not contain the path', () => {
    const expected = 'OK';
    const nested = { keys: { a: 1 } };
    const manager = new ReducerManagement();
    const originalConsole = hideConsoleError();
    const result = manager.generateNested(expected, nested, 'Hogue');
    restoreConsoleError(originalConsole);
    expect(result).toBe(expected);
  });

  it('should return value inside the root key if the nested has a empty path', () => {
    const expected = 'OK';
    const nested = {
      keys: {},
      path: [],
    };
    const manager = new ReducerManagement();
    const result = manager.generateNested({}, nested, expected);
    expect(result.root).toBe(expected);
  });

  it('should convert all the path with keys', () => {
    const value = 'OK';
    const expected = { 'Mock A': { 'Mock B': value } };
    const nested = {
      keys: { a: 'Mock A', b: 'Mock B' },
      path: ['a', 'b'],
    };
    const manager = new ReducerManagement();
    const result = manager.generateNested({}, nested, value);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });

  it('should convert all the path with missing key', () => {
    const value = 'OK';
    const expected = { 'Mock A': { 'Mock B': { d: value } } };
    const nested = {
      keys: { a: 'Mock A', b: 'Mock B' },
      path: ['a', 'b', 'd'],
    };
    const manager = new ReducerManagement();
    const result = manager.generateNested({}, nested, value);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> combineShallow', () => {
  it('should throw an error for state with undefined value', () => {
    const reducers = { OK: testSimpleReducer };
    const state = { invalid: undefined };
    const manager = new ReducerManagement();
    const reducer = manager.combineShallow(reducers);
    expect(() => reducer(state, { type: 'mock' })).toThrow(Error);
  });

  it('should combine two reducers', () => {
    const reducers = { mockA: (_state) => true, mockB: (_state) => false };
    const expected = { mockA: true, mockB: false };
    const state = {};
    const manager = new ReducerManagement();
    const reducer = manager.combineShallow(reducers);
    const result = reducer(state, { type: 'mock' });
    expect(result).toStrictEqual(expected);
  });
});

describe('middleware -> core -> reducer -> ReducerManagement -> getUndefinedStateErrorMessage', () => {
  it('should generate a message with action type', () => {
    const key = 'mock';
    const action = { type: 'MOCK' };
    const expected =
      `Given action "MOCK", reducer "mock" returned undefined. ` +
      `To ignore an action, you must explicitly return the previous state. ` +
      `If you want this reducer to hold no value, you can return null instead of undefined.`;
    const manager = new ReducerManagement();
    const message = manager.getUndefinedStateErrorMessage(key, action);
    expect(message).toBe(expected);
  });

  it('should generate a message without action type', () => {
    const key = 'mock';
    const action = {};
    const expected =
      `Given an action, reducer "mock" returned undefined. ` +
      `To ignore an action, you must explicitly return the previous state. ` +
      `If you want this reducer to hold no value, you can return null instead of undefined.`;
    const manager = new ReducerManagement();
    const message = manager.getUndefinedStateErrorMessage(key, action);
    expect(message).toBe(expected);
  });
});
