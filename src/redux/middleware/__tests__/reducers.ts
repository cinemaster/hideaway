// @ts-nocheck
import { createReducer, HideawayReducerManagement } from '../reducer';
import { testSimpleReducer } from './__ignore_tests__/reducer';
import { identity } from 'ramda';

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

describe('middleware -> core -> reducer -> HideawayReducerManagement -> composeReducers', () => {
  it('should composeReducers return the initial state', () => {
    const initialState = 'Initial state';
    const manager = new HideawayReducerManagement({
      initialState,
      isStateManager: false,
    });
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK_RESPONSE',
    });
    expect(result).toBe(initialState);
  });

  it('should composeReducers to compose with an action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new HideawayReducerManagement({
      initialState,
      isStateManager: false,
    });
    manager.add('MOCK', () => expected);
    const result = manager.composeReducers()(undefined, {
      type: 'MOCK',
    });
    expect(result).toBe(expected);
  });
});

describe('middleware -> core -> reducer -> HideawayReducerManagement -> combine', () => {
  it('should compose with an internal action', () => {
    const initialState = 'Initial state';
    const expected = 'Action result';
    const manager = new HideawayReducerManagement({
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
    const manager = new HideawayReducerManagement({
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
    const manager = new HideawayReducerManagement({
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
});

describe('middleware -> core -> reducer -> HideawayReducerManagement -> compose', () => {
  it('should compose one reducer and return the initial state', () => {
    const initialState = 'Initial';
    const manager = new HideawayReducerManagement();
    const composed = manager.compose(testSimpleReducer);
    const result = composed(initialState, { type: 'MOCK' });
    expect(result).toEqual(initialState);
  });

  it('should compose one reducer and return the action state', () => {
    const initialState = 'Initial';
    const expected = 'Action result';
    const manager = new HideawayReducerManagement();
    const composed = manager.compose(testSimpleReducer);
    const result = composed(initialState, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });

  it('should compose two reducers and return the initial state', () => {
    const initialState = 'Initial';
    const manager = new HideawayReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(initialState, { type: 'MOCK' });
    expect(result).toEqual(initialState);
  });

  it('should compose two reducers and return the action state', () => {
    const initialState = 'Initial';
    const expected = 'Action result';
    const manager = new HideawayReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(initialState, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });
});

describe('middleware -> core -> reducer -> HideawayReducerManagement -> removeState', () => {
  it('should return the same text', () => {
    const text = 'MOCK';
    const manager = new HideawayReducerManagement();
    const result = manager.removeState(text);
    expect(result).toEqual(text);
  });

  it('should remove the suffix', () => {
    const text = 'MOCK';
    const manager = new HideawayReducerManagement();
    ['REQUEST', 'RESPONSE', 'ERROR'].map((item) => {
      const type = `${text}_${item}`;
      const result = manager.removeState(type);
      expect(result).toEqual(text);
    });
  });

  it('should compose two reducers and return the MOCK state', () => {
    const text = 'MOCK';
    const manager = new HideawayReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(text, { type: 'MOCK' });
    expect(result).toEqual(text);
  });

  it('should compose two reducers and return the action state', () => {
    const text = 'MOCK';
    const expected = 'Action result';
    const manager = new HideawayReducerManagement();
    const composed = manager.compose(testSimpleReducer, identity);
    const result = composed(text, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });
});

describe('middleware -> core -> reducer -> HideawayReducerManagement -> add', () => {
  it('should add a simple action', () => {
    const action = 'MOCK';
    const manager = new HideawayReducerManagement({ isStateManager: false });
    manager.add(action, testSimpleReducer);
    expect(manager.reducers[action]).toEqual(testSimpleReducer);
  });

  it('should add a state manager action', () => {
    const action = 'MOCK';
    const manager = new HideawayReducerManagement();
    const expected = manager.generateStatusReducer(action, testSimpleReducer);
    manager.add(action, testSimpleReducer);
    expect(manager.reducers[action].toString()).toBe(expected.toString());
  });
});

describe('middleware -> core -> reducer -> HideawayReducerManagement -> generateStatusReducer', () => {
  it('should return loading as false', () => {
    const manager = new HideawayReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as true', () => {
    const manager = new HideawayReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_REQUEST' });
    expect(result.loading).toBeTruthy();
  });

  it('should return the correct value from the reducer', () => {
    const expected = 'RESULT';
    const manager = new HideawayReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE', text: expected });
    expect(result.value).toEqual(expected);
  });

  it('should return null for the error', () => {
    const manager = new HideawayReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.error).toEqual(null);
  });

  it('should return a value for the error', () => {
    const expected = 'RESULT';
    const manager = new HideawayReducerManagement();
    const reducer = manager.generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    expect(result.error).toEqual(expected);
  });
});

describe('middleware -> core -> reducer -> HideawayReducerManagement -> generateState', () => {
  it('should return loading as true; value with null; error equal null', () => {
    const manager = new HideawayReducerManagement();
    const result = manager.generateState(null, 'MOCK_REQUEST');
    expect(result.loading).toBeTruthy();
    expect(result.value).toEqual(null);
    expect(result.error).toEqual(null);
  });

  it('should return loading as false; value with OK; error equal null', () => {
    const expected = 'OK';
    const manager = new HideawayReducerManagement();
    const result = manager.generateState(expected, 'MOCK');
    expect(result.loading).toBeFalsy();
    expect(result.value).toEqual(expected);
    expect(result.error).toEqual(null);
  });
});

describe('middleware -> core -> reducer -> HideawayReducerManagement -> createInitialState', () => {
  it('should return a string if isStateManager is false', () => {
    const expected = 'OK';
    const manager = new HideawayReducerManagement();
    const result = manager.createInitialState(expected, false);
    expect(result).toBe(expected);
  });

  it('should return an object if isStateManager is true', () => {
    const manager = new HideawayReducerManagement();
    const result = manager.createInitialState(null, true);
    expect(typeof result).toBe('object');
  });
});
