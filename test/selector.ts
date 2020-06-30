import { IHideawaySelectorOptions } from '../src/contracts';
import { getValue } from '../src/selector';

describe('middleware -> action -> getValue', () => {
  it('should return it own state', () => {
    const state = {
      mock: true,
    };
    const options: IHideawaySelectorOptions = { isStateManager: false };
    const result = getValue(state, options);
    expect(result).toEqual(state);
  });

  it('should return the defaultValue if does not find the path', () => {
    const state = {
      mock: true,
    };
    const defaultValue = 'default mock';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['MK'],
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toEqual(defaultValue);
  });

  it('should return the defaultValue for null value', () => {
    const state = {
      mock: null,
    };
    const defaultValue = 'default mock';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toEqual(defaultValue);
  });

  it('should return null if it does not have state and has path', () => {
    const state = {};
    const options: IHideawaySelectorOptions = {
      path: ['mock'],
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toEqual(null);
  });

  it('should return null if does not have the path', () => {
    const state = {
      mock: true,
    };
    const options: IHideawaySelectorOptions = {
      path: ['hogue'],
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toEqual(null);
  });

  it('should return the value if the path is found', () => {
    const state = {
      mock: true,
      isStateManager: false,
    };
    const options: IHideawaySelectorOptions = { path: ['mock'] };
    const result = getValue(state, options);
    expect(result).toBeTruthy();
  });

  it('should return the nested value if does not has a path', () => {
    const state = {
      mock: true,
      isStateManager: false,
    };
    const options: IHideawaySelectorOptions = {
      nested: { keys: {}, path: ['mock'] },
    };
    const result = getValue(state, options);
    expect(result).toBeTruthy();
  });

  it('should return the value if it has nested and path', () => {
    const state = {
      mock: {
        a: {
          b: 'c',
        },
      },
    };
    const options: IHideawaySelectorOptions = {
      path: ['mock'],
      nested: { keys: {}, path: ['a', 'b'] },
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toBe('c');
  });

  it('should return the default if it is nested with not matched path', () => {
    const state = {
      mock: {
        a: {
          b: 'c',
        },
      },
    };
    const defaultValue = 'default';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['d'],
      nested: { keys: {}, path: ['a', 'b'] },
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toBe(defaultValue);
  });

  it('should return the default if it is matched path but not nested', () => {
    const state = {
      mock: {
        a: {
          b: 'c',
        },
      },
    };
    const defaultValue = 'default';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
      nested: { keys: {}, path: ['a', 'c'] },
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toBe(defaultValue);
  });

  it('should return the value if it is matched path and nested with keys translated', () => {
    const state = {
      mock: {
        a: {
          b: 'c',
        },
      },
    };
    const defaultValue = 'default';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
      nested: { keys: { A: 'a', B: 'b' }, path: ['A', 'B'] },
      isStateManager: false,
    };
    const result = getValue(state, options);
    expect(result).toBe('c');
  });

  it('should return the value for the nested and the state manager (without state manager on state)', () => {
    const state = {
      mock: {
        a: {
          b: 'c',
        },
      },
    };
    const defaultValue = 'default';
    const nested = { keys: { A: 'a', B: 'b' }, path: ['A', 'B'] };
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
      nested,
      isStateManager: true,
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual({
      loading: false,
      value: 'c',
      error: null,
      nested,
    });
  });

  it('should return the value for the nested and the state manager', () => {
    const nested = { keys: { A: 'a', B: 'b' }, path: ['A', 'B'] };
    const state = {
      mock: {
        a: {
          b: {
            loading: true,
            value: 'c',
            error: null,
            nested,
          },
        },
      },
    };
    const defaultValue = 'default';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
      nested,
      isStateManager: true,
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual({
      loading: true,
      value: 'c',
      error: null,
      nested,
    });
  });

  it('should return the defaultValue if the value is null  (without state manager on state)', () => {
    const state = { mock: null };
    const defaultValue = 'default';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
      isStateManager: true,
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual({
      loading: false,
      value: defaultValue,
      error: null,
    });
  });

  it('should return the defaultValue if the value is null', () => {
    const state = {
      mock: {
        loading: true,
        value: null,
        error: null,
      },
    };
    const defaultValue = 'default';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
      isStateManager: true,
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual({
      loading: true,
      value: defaultValue,
      error: null,
    });
  });

  it('should return the state manager format', () => {
    const result = getValue(null);
    expect(result).toStrictEqual({
      loading: false,
      value: null,
      error: null,
    });
  });
});
