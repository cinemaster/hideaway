// @ts-nocheck
import _ from 'lodash';
import { generateStatusReducer } from '../src/manager';
import { ReducerManagement } from '../src/reducer';
import {
  hideConsoleError,
  restoreConsoleError,
  restoreConsoleWarn,
  hideConsoleWarn,
} from './__ignore_tests__/common';
import { isObject } from '../src/utils';
import { testReducer } from './__ignore_tests__/reducer';

describe('reducer -> ReducerManagement -> composeReducers', () => {
  const initialState = 'Initial state';

  describe('With the nested and the state manager', () => {
    const isStateManager = true;
    const isNested = true;
    const nested = {
      keys: {},
      path: ['a'],
    };
    const params = {
      initialState,
      isStateManager,
      isNested,
      nested,
      reducers: { MOCK: (_state, { payload }) => payload },
    };
    const action = {
      type: 'MOCK_RESPONSE',
      nested,
    };

    it('should return the initial state for action with type only', () => {
      const manager = new ReducerManagement(params);
      const expected = {
        a: {
          loading: false,
          value: initialState,
          error: null,
          nested,
        },
      };
      const originalConsole = hideConsoleWarn();
      const result = manager.composeReducers()(undefined, {
        ...action,
        nested: undefined,
      });
      restoreConsoleWarn(originalConsole);
      expect(result).toStrictEqual(expected);
    });

    it('should return an empty object for undefined nested', () => {
      const value = {};
      const manager = new ReducerManagement({ ...params, nested: undefined });
      const originalConsole = hideConsoleWarn();
      const result = manager.composeReducers()(undefined, {
        ...action,
        nested: undefined,
      });
      restoreConsoleWarn(originalConsole);
      expect(result).toStrictEqual(value);
    });

    it('should allow reset the object', () => {
      const value = {};
      const manager = new ReducerManagement({
        ...params,
        reducers: { RESET_OBJ: () => ({}) },
      });
      const originalConsole = hideConsoleWarn();
      const result = manager.composeReducers()(undefined, {
        type: 'RESET_OBJ_RESPONSE',
        nested: {
          allObject: true,
        },
      });
      restoreConsoleWarn(originalConsole);
      expect(result).toStrictEqual(value);
    });

    it('should return a string', () => {
      const value = 'result';
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a.value).toBe(value);
    });

    it('should return a number', () => {
      const value = 1;
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a.value).toBe(value);
    });

    it('should return an empty array', () => {
      const value = [];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a.value).toBe(value);
    });

    it('should return an array', () => {
      const value = ['OK'];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a.value).toBe(value);
    });

    it('should return an empty object', () => {
      const value = {};
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a.value).toBe(value);
    });

    it('should return an object', () => {
      const value = { OK: 1 };
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a.value).toBe(value);
    });

    it('should return null', () => {
      const value = null;
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a.value).toBe(value);
    });
  });

  describe('Without the nested and the state manager', () => {
    const isStateManager = false;
    const params = {
      initialState,
      isStateManager,
      reducers: { MOCK: (_state, { payload }) => payload },
    };
    const action = { type: 'MOCK' };

    it('should return the initial state', () => {
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        type: 'NO_MATCH',
      });
      expect(result).toBe(initialState);
    });

    it('should return a string', () => {
      const value = 'result';
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      expect(result).toBe(value);
    });

    it('should return a number', () => {
      const value = 1;
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      expect(result).toBe(value);
    });

    it('should return an empty array', () => {
      const value = [];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      expect(result).toBe(value);
    });

    it('should return an array', () => {
      const value = ['OK'];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      expect(result).toBe(value);
    });

    it('should return an empty object', () => {
      const value = {};
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      expect(result).toBe(value);
    });

    it('should return an object', () => {
      const value = { OK: 1 };
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      expect(result).toBe(value);
    });

    it('should return null', () => {
      const value = null;
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      expect(result).toBe(value);
    });
  });

  describe('State Manager', () => {
    const params = {
      initialState,
      reducers: { MOCK: (_state, { payload }) => payload },
    };
    const action = { type: 'MOCK_RESPONSE' };

    it('should display the error on console', () => {
      const displayError = true;
      const consoleMock = jest.fn();
      const originalConsole = hideConsoleError(consoleMock);
      const expected = new TypeError('RESULT');
      const manager = new ReducerManagement({
        ...params,
        displayError,
        reducers: { MOCK: testReducer },
      });
      const action = { type: 'MOCK_ERROR', payload: expected };
      const result = manager.composeReducers()(undefined, action);
      restoreConsoleError(originalConsole);
      expect(result.error.toString()).toEqual(expected.toString());
      expect(consoleMock.mock.calls.length).toBe(1);
    });

    it('should return the initial state', () => {
      const manager = new ReducerManagement({ ...params, reducers: undefined });
      const expected = { loading: false, value: initialState, error: null };
      const result = manager.composeReducers()(undefined, action);
      expect(result).toStrictEqual(expected);
    });

    it('should return a state format', () => {
      const value = 'result';
      const manager = new ReducerManagement({
        ...params,
        reducers: { MOCK: (_state, { payload }) => payload },
      });
      const result = manager.composeReducers()(
        {},
        { ...action, payload: value },
      );
      expect(result.value).toBe(value);
    });

    it('should return a string', () => {
      const value = 'OK';
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      const expected = { error: null, loading: false, value };
      expect(result).toStrictEqual(expected);
    });

    it('should return a number', () => {
      const value = 1;
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      const expected = { error: null, loading: false, value };
      expect(result).toStrictEqual(expected);
    });

    it('should return an empty array', () => {
      const value = [];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      const expected = { error: null, loading: false, value };
      expect(result).toStrictEqual(expected);
    });

    it('should return an array', () => {
      const value = ['OK'];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      const expected = { error: null, loading: false, value };
      expect(result).toStrictEqual(expected);
    });

    it('should return an empty object', () => {
      const value = {};
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      const expected = { error: null, loading: false, value };
      expect(result).toStrictEqual(expected);
    });

    it('should return an object', () => {
      const value = { OK: 1 };
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      const expected = { error: null, loading: false, value };
      expect(result).toStrictEqual(expected);
    });

    it('should return null', () => {
      const value = null;
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(undefined, {
        ...action,
        payload: value,
      });
      const expected = { error: null, loading: false, value };
      expect(result).toStrictEqual(expected);
    });
  });

  describe('Nested', () => {
    const isStateManager = false;
    const isNested = true;
    const nested = { keys: {}, path: ['a'] };
    const params = {
      initialState,
      isStateManager,
      isNested,
      nested,
      reducers: { MOCK: (_state, { payload }) => payload },
    };
    const action = { type: 'MOCK_RESPONSE', nested };

    it('should return the initial state for action with type only', () => {
      const manager = new ReducerManagement(params);
      const expected = { a: initialState };
      const originalConsole = hideConsoleWarn();
      const result = manager.composeReducers()(undefined, {
        ...action,
        nested: undefined,
      });
      restoreConsoleWarn(originalConsole);
      expect(result).toStrictEqual(expected);
    });

    it('should return a nested path and joing previous nested object', () => {
      const value = 'result';
      const manager = new ReducerManagement({
        ...params,
        nested: { keys: {}, path: ['a', 'b'] },
      });
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        nested: { keys: {}, path: ['a', 'c'] },
        payload: value,
      });
      expect(result).toStrictEqual({ a: { b: initialState, c: value } });
    });

    it('should warn for action without nested attribute', () => {
      const consoleMock = jest.fn();
      const originalConsole = hideConsoleWarn(consoleMock);
      const manager = new ReducerManagement(params);
      manager.composeReducers()(undefined, { ...action, nested: undefined });
      restoreConsoleWarn(originalConsole);
      expect(consoleMock.mock.calls.length).toBe(1);
    });

    it('should return a string', () => {
      const value = 'OK';
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a).toBe(value);
    });

    it('should return a number', () => {
      const value = 1;
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a).toBe(value);
    });

    it('should return an empty array', () => {
      const value = [];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a).toBe(value);
    });

    it('should return an array', () => {
      const value = ['OK'];
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a).toBe(value);
    });

    it('should return an empty object', () => {
      const value = {};
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a).toBe(value);
    });

    it('should return an object', () => {
      const value = { OK: 1 };
      const manager = new ReducerManagement(params);
      const result = manager.composeReducers()(manager.initialState, {
        ...action,
        payload: value,
      });
      expect(result.a).toBe(value);
    });
  });
});

describe('reducer -> ReducerManagement -> combine', () => {
  it('should compose with an internal action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new ReducerManagement({
      initialState,
      isStateManager: false,
      reducers: { MOCK: (_state, { payload }) => payload },
    });
    const result = manager.combine()(undefined, {
      type: 'MOCK',
      payload: expected,
    });
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
      SIMPLE_ACTION: testReducer,
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
        SIMPLE_ACTION: testReducer,
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
        SIMPLE_ACTION: testReducer,
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
    manager.add(action, testReducer);
    expect(manager.reducers[action]).toEqual(testReducer);
  });

  it('should add a state manager action', () => {
    const action = 'MOCK';
    const manager = new ReducerManagement();
    const expected = generateStatusReducer(action, testReducer);
    manager.add(action, testReducer);
    expect(manager.reducers[action].toString()).toBe(expected.toString());
  });
});

describe('reducer -> ReducerManagement -> createInitialState', () => {
  describe('Without the nested and the state manager', () => {
    const isStateManager = false;
    const isNested = false;
    const manager = new ReducerManagement();

    it('should return a string', () => {
      const expected = 'OK';
      const result = manager.createInitialState(
        expected,
        isStateManager,
        isNested,
      );
      expect(result).toBe(expected);
    });

    it('should return a number', () => {
      const expected = 1;
      const result = manager.createInitialState(
        expected,
        isStateManager,
        isNested,
      );
      expect(result).toBe(expected);
    });

    it('should return an empty array', () => {
      const expected = [];
      const result = manager.createInitialState(
        expected,
        isStateManager,
        isNested,
      );
      expect(result).toBe(expected);
    });

    it('should return an array', () => {
      const expected = ['OK'];
      const result = manager.createInitialState(
        expected,
        isStateManager,
        isNested,
      );
      expect(result).toBe(expected);
    });

    it('should return an empty object', () => {
      const expected = {};
      const result = manager.createInitialState(
        expected,
        isStateManager,
        isNested,
      );
      expect(result).toBe(expected);
    });

    it('should return an object', () => {
      const expected = { OK: 1 };
      const result = manager.createInitialState(
        expected,
        isStateManager,
        isNested,
      );
      expect(result).toBe(expected);
    });

    it('should return null', () => {
      const expected = null;
      const result = manager.createInitialState(
        expected,
        isStateManager,
        isNested,
      );
      expect(result).toBe(expected);
    });
  });

  describe('With the nested and the state manager', () => {
    const isStateManager = true;
    const isNested = true;
    const manager = new ReducerManagement({
      isStateManager,
      isNested,
    });

    it('should return an empty object for undefined nested', () => {
      const result = manager.createInitialState(null, isStateManager, isNested);
      expect(result).toStrictEqual({});
    });

    it('should return a string', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = 'OK';
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: { loading: false, value, error: null, nested },
      });
    });

    it('should return a number', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = 1;
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: { loading: false, value, error: null, nested },
      });
    });

    it('should return an empty array', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = [];
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: { loading: false, value, error: null, nested },
      });
    });

    it('should return an array', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = ['OK'];
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: { loading: false, value, error: null, nested },
      });
    });

    it('should return an empty object', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = {};
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: { loading: false, value, error: null, nested },
      });
    });

    it('should return an object', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = { OK: 1 };
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: { loading: false, value, error: null, nested },
      });
    });

    it('should return null', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = null;
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: { loading: false, value, error: null, nested },
      });
    });
  });

  describe('State Manager', () => {
    const isStateManager = true;
    const isNested = false;
    const manager = new ReducerManagement();

    it('should return a string', () => {
      const value = 'OK';
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(result).toStrictEqual({
        loading: false,
        value,
        error: null,
      });
    });

    it('should return a number', () => {
      const value = 1;
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(result).toStrictEqual({
        loading: false,
        value,
        error: null,
      });
    });

    it('should return an empty array', () => {
      const value = [];
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(result).toStrictEqual({
        loading: false,
        value,
        error: null,
      });
    });

    it('should return an array', () => {
      const value = ['OK'];
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(result).toStrictEqual({
        loading: false,
        value,
        error: null,
      });
    });

    it('should return an empty object', () => {
      const value = {};
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(result).toStrictEqual({
        loading: false,
        value,
        error: null,
      });
    });

    it('should return an object', () => {
      const value = { OK: 1 };
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(result).toStrictEqual({
        loading: false,
        value,
        error: null,
      });
    });

    it('should return null', () => {
      const value = null;
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(result).toStrictEqual({
        loading: false,
        value,
        error: null,
      });
    });
  });

  describe('Nested', () => {
    const isStateManager = false;
    const isNested = true;
    const manager = new ReducerManagement();

    it('should return an empty object for undefined nested', () => {
      const value = null;
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
      );
      expect(_.isEmpty(result)).toBeTruthy();
      expect(isObject(result)).toBeTruthy();
    });

    it('should return a string', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = 'OK';
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: value,
      });
    });

    it('should return a number', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = 1;
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: value,
      });
    });

    it('should return an empty array', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = [];
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: value,
      });
    });

    it('should return an array', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = ['OK'];
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: value,
      });
    });

    it('should return an empty object', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = {};
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: value,
      });
    });

    it('should return an object', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = { OK: 1 };
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: value,
      });
    });

    it('should return null', () => {
      const nested = { keys: {}, path: ['mock'] };
      const value = null;
      const result = manager.createInitialState(
        value,
        isStateManager,
        isNested,
        nested,
      );
      expect(result).toStrictEqual({
        mock: value,
      });
    });
  });
});
