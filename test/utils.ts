import {
  createReducer,
  compose,
  getUndefinedStateErrorMessage,
  combineShallow,
} from '../src/utils';
import { testSimpleReducer } from './__ignore_tests__/reducer';
import { identity } from 'ramda';
import { IHideawayActionContent } from '../src/contracts';

describe('utils -> createReducer', () => {
  it('should return the initial state', () => {
    const initialState: string | null = 'Initial state';
    const reducer = createReducer(initialState, {});
    const state = (undefined as unknown) as string;
    const result = reducer(state, { type: '' });
    expect(result).toBe('Initial state');
  });

  it('should return the action string state', () => {
    const initialState: string | null = 'Initial state';
    const expected = 'Action result';
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const state = (undefined as unknown) as string;
    const result = reducer(state, { type: 'MOCK' });
    expect(result).toBe(expected);
  });

  it('should return the action number state', () => {
    const initialState: number | null = 1978;
    const expected = 1110;
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const state = (undefined as unknown) as number;
    const result = reducer(state, { type: 'MOCK' });
    expect(result).toBe(expected);
  });

  it('should return the action list state', () => {
    const initialState: number[] | null = [];
    const expected = [1978];
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const state = (undefined as unknown) as number[];
    const result = reducer(state, { type: 'MOCK' });
    expect(result).toBe(expected);
  });

  it('should return the action object state', () => {
    const initialState: object | null = {};
    const expected = { year: 1978 };
    const reducer = createReducer(initialState, { MOCK: () => expected });
    const state = (undefined as unknown) as object;
    const result = reducer(state, { type: 'MOCK' });
    expect(result).toBe(expected);
  });
});

describe('utils -> compose', () => {
  it('should compose one reducer and return the initial state', () => {
    const initialState = 'Initial';
    const composed = compose(testSimpleReducer);
    const result = composed(initialState, { type: 'MOCK' });
    expect(result).toEqual(initialState);
  });

  it('should compose one reducer and return the action state', () => {
    const initialState = 'Initial';
    const expected = 'Action result';
    const composed = compose(testSimpleReducer);
    const result = composed(initialState, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });

  it('should compose two reducers and return the initial state', () => {
    const initialState = 'Initial';
    const composed = compose(testSimpleReducer, identity);
    const result = composed(initialState, { type: 'MOCK' });
    expect(result).toEqual(initialState);
  });

  it('should compose two reducers and return the action state', () => {
    const initialState = 'Initial';
    const expected = 'Action result';
    const composed = compose(testSimpleReducer, identity);
    const result = composed(initialState, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });

  it('should compose two reducers and return the MOCK state', () => {
    const text = 'MOCK';
    const composed = compose(testSimpleReducer, identity);
    const result = composed(text, { type: 'MOCK' });
    expect(result).toEqual(text);
  });

  it('should compose two reducers and return the action state', () => {
    const text = 'MOCK';
    const expected = 'Action result';
    const composed = compose(testSimpleReducer, identity);
    const result = composed(text, { type: 'MOCK', text: expected });
    expect(result).toEqual(expected);
  });
});

describe('utils -> getUndefinedStateErrorMessage', () => {
  it('should generate a message with action type', () => {
    const key = 'mock';
    const action = { type: 'MOCK' };
    const expected =
      `Given action "MOCK", reducer "mock" returned undefined. ` +
      `To ignore an action, you must explicitly return the previous state. ` +
      `If you want this reducer to hold no value, you can return null instead of undefined.`;
    const message = getUndefinedStateErrorMessage(key, action);
    expect(message).toBe(expected);
  });

  it('should generate a message without action type', () => {
    const key = 'mock';
    const action = ({} as unknown) as IHideawayActionContent<any>;
    const expected =
      `Given an action, reducer "mock" returned undefined. ` +
      `To ignore an action, you must explicitly return the previous state. ` +
      `If you want this reducer to hold no value, you can return null instead of undefined.`;
    const message = getUndefinedStateErrorMessage(key, action);
    expect(message).toBe(expected);
  });
});

describe('utils -> combineShallow', () => {
  it('should throw an error for state with undefined value', () => {
    const reducers = { OK: testSimpleReducer };
    const state = { invalid: undefined };
    const reducer = combineShallow(reducers);
    expect(() => reducer(state, { type: 'mock' })).toThrow(Error);
  });

  it('should combine two reducers', () => {
    const reducers = { mockA: () => true, mockB: () => false };
    const expected = { mockA: true, mockB: false };
    const state = {};
    const reducer = combineShallow(reducers);
    const result = reducer(state, { type: 'mock' });
    expect(result).toStrictEqual(expected);
  });
});
