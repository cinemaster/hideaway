import { IHideawayNestedProps } from '../src/contracts';
import {
  generateStatusReducer,
  hasStateObject,
  removeState,
  validateStateManager,
} from '../src/manager';
import {
  hideConsoleError,
  restoreConsoleError,
} from './__ignore_tests__/common';
import { testReducer } from './__ignore_tests__/reducer';

describe('manager -> generateStatusReducer', () => {
  it('should return loading as false for simple action', () => {
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as false for action RESPONSE', () => {
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as false for action ERROR', () => {
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: 'mock' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as true', () => {
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK_REQUEST' });
    expect(result.loading).toBeTruthy();
  });

  it('should return the correct value from the reducer', () => {
    const expected = 'RESULT';
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE', text: expected });
    expect(result.value).toEqual(expected);
  });

  it('should return null for the error', () => {
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.error).toEqual(null);
  });

  it('should return a value for the error', () => {
    const expected = 'RESULT';
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    expect(result.error).toEqual(expected);
  });

  it('should reset the value attribute', () => {
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer(
      { loading: true, value: 'mock', error: null },
      { type: 'MOCK_ERROR', payload: 'ERROR' },
    );
    expect(result.value).toBeNull();
  });

  it('should display the error without console', () => {
    const originalConsole = hideConsoleError();
    const expected = new TypeError('RESULT');
    const reducer = generateStatusReducer('MOCK', testReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    restoreConsoleError(originalConsole);
    expect(result.error.toString()).toEqual(expected.toString());
  });

  it('should display the error on console', () => {
    const consoleMock = jest.fn();
    const originalConsole = hideConsoleError(consoleMock);
    const expected = new TypeError('RESULT');
    const isNested = false;
    const displayError = true;
    const reducer = generateStatusReducer(
      'MOCK',
      testReducer,
      isNested,
      displayError,
    );
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    restoreConsoleError(originalConsole);
    expect(result.error.toString()).toEqual(expected.toString());
    expect(consoleMock.mock.calls.length).toBe(1);
  });

  it('should display empty key and path for nested', () => {
    const expected: IHideawayNestedProps = { keys: {}, path: [] };
    const originalConsole = hideConsoleError();
    const isNested = true;
    restoreConsoleError(originalConsole);
    const reducer = generateStatusReducer('MOCK', testReducer, isNested);
    const result = reducer({}, { type: 'MOCK_RESPONSE' });
    expect(result.nested).toEqual(expected);
  });

  it('should display keys and path for nested', () => {
    const keys = { a: 1 };
    const path = [] as string[];
    const expected: IHideawayNestedProps = { keys, path };
    const originalConsole = hideConsoleError();
    const isNested = true;
    restoreConsoleError(originalConsole);
    const reducer = generateStatusReducer('MOCK', testReducer, isNested);
    const result = reducer({}, { type: 'MOCK_REQUEST', nested: expected });
    expect(result.nested).toEqual(expected);
  });
});

describe('utils -> removeState', () => {
  it('should return the same text', () => {
    const text = 'MOCK';
    const result = removeState(text);
    expect(result).toEqual(text);
  });

  it('should remove the suffix', () => {
    const text = 'MOCK';
    ['REQUEST', 'RESPONSE', 'ERROR'].map((item) => {
      const type = `${text}_${item}`;
      const result = removeState(type);
      expect(result).toEqual(text);
    });
  });
});

describe('utils -> hasStateObject', () => {
  it('should return false for value that is not an object', () => {
    expect(hasStateObject(1)).toBeFalsy();
  });

  it('should return false for object without state manager', () => {
    expect(hasStateObject({})).toBeFalsy();
  });

  it('should return true for object with state manager', () => {
    expect(
      hasStateObject({ loading: true, value: null, error: null }),
    ).toBeTruthy();
  });
});

describe('utils -> validateStateManager', () => {
  it('should return the state manager with the value', () => {
    const value = 1;
    expect(validateStateManager(value)).toStrictEqual({
      loading: false,
      value,
      error: null,
    });
  });

  it('should return the state manager', () => {
    const value = {
      loading: false,
      value: null,
      error: null,
    };
    expect(validateStateManager(value)).toStrictEqual(value);
  });
});
