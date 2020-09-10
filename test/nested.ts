import {
  generatePath,
  getPathDifference,
  generateNested,
  reducerNested,
} from '../src/nested';
import { IHideawayNestedProps } from '../src/contracts';
import {
  hideConsoleError,
  restoreConsoleError,
} from './__ignore_tests__/common';

describe('nested -> generatePath', () => {
  it('should return an empty path', () => {
    const nested: IHideawayNestedProps = {
      keys: {},
      path: [],
    };
    const expected = [] as string[];
    const result = generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return an empty path if keys attribute is missing', () => {
    const nested = {
      path: [],
    };
    const expected = [] as string[];
    const result = generatePath((nested as unknown) as IHideawayNestedProps);
    expect(result).toStrictEqual(expected);
  });

  it('should return an empty path if path attribute is missing', () => {
    const nested = {
      keys: {},
    };
    const expected = [] as string[];
    const result = generatePath((nested as unknown) as IHideawayNestedProps);
    expect(result).toStrictEqual(expected);
  });

  it('should return an empty path if does not send the nested object', () => {
    const expected = [] as string[];
    const result = generatePath();
    expect(result).toStrictEqual(expected);
  });

  it('should return an empty path (with keys)', () => {
    const nested: IHideawayNestedProps = {
      keys: { a: 1 },
      path: [],
    };
    const expected = [] as string[];
    const result = generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return a path without keys', () => {
    const nested: IHideawayNestedProps = {
      keys: {},
      path: ['a'],
    };
    const expected = ['a'];
    const result = generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return a path with keys', () => {
    const nested: IHideawayNestedProps = {
      keys: { a: 'mock' },
      path: ['a'],
    };
    const expected = ['mock'];
    const result = generatePath(nested);
    expect(result).toStrictEqual(expected);
  });

  it('should return a path with missing key', () => {
    const nested: IHideawayNestedProps = {
      keys: { a: 'mock' },
      path: ['a', 'b'],
    };
    const expected = ['mock', 'b'];
    const result = generatePath(nested);
    expect(result).toStrictEqual(expected);
  });
});

describe('nested -> getPathDifference', () => {
  it('should return the object if the path is empty', () => {
    const obj = {};
    const path = [] as string[];
    const expected = obj;
    const result = getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object if the value is null', () => {
    const obj = null; // null has typeof equal to object
    const path = [] as string[];
    const expected = obj;
    const result = getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object if the path does not match', () => {
    const obj = { a: 1 };
    const path = ['one'];
    const expected = obj;
    const result = getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object with the difference of the partial path', () => {
    const obj = { a: { b: { c: { key: 'd', e: true } } } };
    const path = ['a', 'b', 'f'];
    const expected = { c: { key: 'd', e: true } };
    const result = getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the integer', () => {
    const obj = 1;
    const path = ['a', 'b', 'f'];
    const expected = obj;
    const result = getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });

  it('should return the object with the difference of the path', () => {
    const obj = { a: { b: { c: { key: 'd', e: true } } } };
    const path = ['a', 'b', 'c'];
    const expected = { key: 'd', e: true };
    const result = getPathDifference(obj, path);
    expect(result).toStrictEqual(expected);
  });
});

describe('nested -> generateNested', () => {
  it('should return the previous state if the nested does not contain the key', () => {
    const expected = 'OK';
    const nested = ({} as unknown) as IHideawayNestedProps;
    const originalConsole = hideConsoleError();
    const result = generateNested(expected, nested, 'Hogue');
    restoreConsoleError(originalConsole);
    expect(result).toBe(expected);
  });

  it('should return the previous state if the nested does not contain the keys', () => {
    const expected = 'OK';
    const nested = ({ path: ['one'] } as unknown) as IHideawayNestedProps;
    const originalConsole = hideConsoleError();
    const result = generateNested(expected, nested, 'Hogue');
    restoreConsoleError(originalConsole);
    expect(result).toBe(expected);
  });

  it('should return the previous state if the nested does not contain the path', () => {
    const expected = 'OK';
    const nested = ({ keys: { a: 1 } } as unknown) as IHideawayNestedProps;
    const originalConsole = hideConsoleError();
    const result = generateNested(expected, nested, 'Hogue');
    restoreConsoleError(originalConsole);
    expect(result).toBe(expected);
  });

  it('should return value inside the root key if the nested has a empty path', () => {
    const expected = 'OK';
    const nested = {
      keys: {},
      path: [],
    };
    const result = generateNested({}, nested, expected) as { root: any };
    expect(result.root).toBe(expected);
  });

  it('should convert all the path with keys', () => {
    const value = 'OK';
    const expected = { 'Mock A': { 'Mock B': value } };
    const nested = {
      keys: { a: 'Mock A', b: 'Mock B' },
      path: ['a', 'b'],
    };
    const result = generateNested({}, nested, value);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });

  it('should convert all the path with missing key', () => {
    const value = 'OK';
    const expected = { 'Mock A': { 'Mock B': { d: value } } };
    const nested = {
      keys: { a: 'Mock A', b: 'Mock B' },
      path: ['a', 'b', 'd'],
    };
    const result = generateNested({}, nested, value);
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
  });
});

describe('nested -> reducerNested', () => {
  const obj = { a: true };
  const reducer = () => obj;

  it('should return the value', () => {
    const result = reducerNested(obj, { type: 'mock' }, reducer);
    expect(result).toBe(obj);
  });

  it('should return the value nested', () => {
    const nested = {
      keys: {},
      path: ['a'],
    } as IHideawayNestedProps;
    const result = reducerNested(obj, { type: 'mock', nested }, reducer);
    expect(result).toBeTruthy();
  });
});
