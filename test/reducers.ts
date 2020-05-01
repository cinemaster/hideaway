// @ts-nocheck
import _ from 'lodash';
import { generateStatusReducer } from '../src/manager';
import { ReducerManagement } from '../src/reducer';
import {
  hideConsoleError,
  restoreConsoleError,
} from './__ignore_tests__/common';
import { testSimpleReducer } from './__ignore_tests__/reducer';

describe('reducer -> ReducerManagement -> composeReducers', () => {
  it('should display the error on console', () => {
    const originalConsole = console.error;
    const consoleMock = jest.fn();
    console.error = consoleMock;
    const expected = new TypeError('RESULT');
    const manager = new ReducerManagement({ displayError: true });
    const reducer = generateStatusReducer(
      'MOCK',
      testSimpleReducer,
      manager.isNested,
      manager.displayError,
    );
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    console.error = originalConsole;
    expect(result.error.toString()).toEqual(expected.toString());
    expect(consoleMock.mock.calls.length).toBe(1);
  });
});

describe('reducer -> ReducerManagement -> composeReducers', () => {
  it('should return null if not use options', () => {
    const manager = new ReducerManagement();
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    const expected = { error: null, loading: false, value: null };
    expect(result).toStrictEqual(expected);
  });

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

  it('should return the initial state for nested without state manager and action with type only', () => {
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
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(result).toStrictEqual(expected);
  });

  it('should return the initial state for nested with state manager and action with type only', () => {
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
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
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

  it('should return an empty object for isNested=true, isState=false and undefined state', () => {
    const initialState = 'Initial state';
    const value = {};
    const manager = new ReducerManagement({
      initialState,
      isNested: true,
      isStateManager: false,
    });
    manager.add('MOCK', (state) => state);
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(result).toStrictEqual(value);
  });

  it('should return an empty object for isNested=true, isState=true and undefined state', () => {
    const initialState = 'Initial state';
    const value = {};
    const manager = new ReducerManagement({
      initialState,
      isNested: true,
      isStateManager: true,
    });
    manager.add('MOCK', (state) => state);
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(result).toStrictEqual(value);
  });
});

describe('reducer -> ReducerManagement -> combine', () => {
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

describe('reducer -> ReducerManagement -> add', () => {
  it('should add a simple action', () => {
    const action = 'MOCK';
    const manager = new ReducerManagement({ isStateManager: false });
    manager.add(action, testSimpleReducer);
    expect(manager.reducers[action]).toEqual(testSimpleReducer);
  });

  it('should add a state manager action', () => {
    const action = 'MOCK';
    const manager = new ReducerManagement();
    const expected = generateStatusReducer(action, testSimpleReducer);
    manager.add(action, testSimpleReducer);
    expect(manager.reducers[action].toString()).toBe(expected.toString());
  });
});

describe('reducer -> ReducerManagement -> createInitialState', () => {
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
