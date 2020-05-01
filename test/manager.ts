import { IHideawayNestedProps } from '../src/contracts';
import { generateStatusReducer, removeState } from '../src/manager';
import {
  hideConsoleError,
  restoreConsoleError,
} from './__ignore_tests__/common';
import { testSimpleReducer } from './__ignore_tests__/reducer';

describe('manager -> generateStatusReducer', () => {
  it('should return loading as false for simple action', () => {
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as false for action RESPONSE', () => {
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as false for action ERROR', () => {
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: 'mock' });
    expect(result.loading).toBeFalsy();
  });

  it('should return loading as true', () => {
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_REQUEST' });
    expect(result.loading).toBeTruthy();
  });

  it('should return the correct value from the reducer', () => {
    const expected = 'RESULT';
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_RESPONSE', text: expected });
    expect(result.value).toEqual(expected);
  });

  it('should return null for the error', () => {
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK' });
    expect(result.error).toEqual(null);
  });

  it('should return a value for the error', () => {
    const expected = 'RESULT';
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    expect(result.error).toEqual(expected);
  });

  it('should display the error without console', () => {
    const originalConsole = hideConsoleError();
    const expected = new TypeError('RESULT');
    const reducer = generateStatusReducer('MOCK', testSimpleReducer);
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    restoreConsoleError(originalConsole);
    expect(result.error.toString()).toEqual(expected.toString());
  });

  it('should display the error on console', () => {
    const originalConsole = console.error;
    const consoleMock = jest.fn();
    console.error = consoleMock;
    const expected = new TypeError('RESULT');
    const isNested = false;
    const displayError = true;
    const reducer = generateStatusReducer(
      'MOCK',
      testSimpleReducer,
      isNested,
      displayError,
    );
    const result = reducer({}, { type: 'MOCK_ERROR', payload: expected });
    console.error = originalConsole;
    expect(result.error.toString()).toEqual(expected.toString());
    expect(consoleMock.mock.calls.length).toBe(1);
  });

  it('should display empty key and path for nested', () => {
    const expected: IHideawayNestedProps = { keys: {}, path: [] };
    const originalConsole = hideConsoleError();
    const isNested = true;
    restoreConsoleError(originalConsole);
    const reducer = generateStatusReducer('MOCK', testSimpleReducer, isNested);
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
    const reducer = generateStatusReducer('MOCK', testSimpleReducer, isNested);
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
