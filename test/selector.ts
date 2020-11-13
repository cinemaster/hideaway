import { IHideawaySelectorOptions } from '../src/contracts';
import { getState, getValue } from '../src/selector';

describe('middleware -> action -> getValue', () => {
  it('should return null', () => {
    const result = getValue(null);
    expect(result).toStrictEqual(null);
  });

  it('should return it own state', () => {
    const state = {
      mock: true,
    };
    const options: IHideawaySelectorOptions = {};
    const result = getValue(state, options);
    expect(result).toStrictEqual(state);
  });

  it('should return the defaultValue if does not find the path', () => {
    const state = {
      mock: true,
    };
    const defaultValue = 'default mock';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['MK'],
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual(defaultValue);
  });

  it('should return the defaultValue for null value', () => {
    const state = {
      mock: null,
    };
    const defaultValue = 'default mock';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual(defaultValue);
  });

  it('should return null if it does not have state and has path', () => {
    const state = {};
    const options: IHideawaySelectorOptions = {
      path: ['mock'],
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual(null);
  });

  it('should return null if does not have the path', () => {
    const state = {
      mock: true,
    };
    const options: IHideawaySelectorOptions = {
      path: ['hogue'],
    };
    const result = getValue(state, options);
    expect(result).toStrictEqual(null);
  });

  it('should return the value if the path is found', () => {
    const state = {
      mock: true,
    };
    const options: IHideawaySelectorOptions = { path: ['mock'] };
    const result = getValue(state, options);
    expect(result).toBeTruthy();
  });

  it('should return the nested value if does not has a path', () => {
    const state = {
      mock: true,
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
    };
    const result = getValue(state, options);
    expect(result).toBe('c');
  });
});

describe('middleware -> action -> getState', () => {
  const nested = {
    allObject: false,
    keys: {},
    path: [],
  };

  it('should return the state manager', () => {
    const state = { mock: true };
    const options: IHideawaySelectorOptions = {};
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested,
      value: state,
    });
  });

  it('should return the defaultValue if does not find the path', () => {
    const state = { mock: true };
    const defaultValue = 'default mock';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['MK'],
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested,
      value: defaultValue,
    });
  });

  it('should return the defaultValue for null value', () => {
    const state = { mock: null };
    const defaultValue = 'default mock';
    const options: IHideawaySelectorOptions = {
      defaultValue,
      path: ['mock'],
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested,
      value: defaultValue,
    });
  });

  it('should return null if it does not have state and has path', () => {
    const state = {};
    const options: IHideawaySelectorOptions = {
      path: ['mock'],
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested,
      value: null,
    });
  });

  it('should return null if does not have the path', () => {
    const state = {
      mock: true,
    };
    const options: IHideawaySelectorOptions = {
      path: ['hogue'],
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested,
      value: null,
    });
  });

  it('should return the nested value if does not has a path', () => {
    const state = {
      mock: true,
      mock2: false,
    };
    const options: IHideawaySelectorOptions = {
      nested: { keys: {}, path: ['mock'] },
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested: { keys: {}, path: ['mock'] },
      value: true,
    });
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
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested: { keys: {}, path: ['a', 'b'] },
      value: 'c',
    });
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
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested: { keys: {}, path: ['a', 'b'] },
      value: defaultValue,
    });
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
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested: { keys: {}, path: ['a', 'c'] },
      value: defaultValue,
    });
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
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      error: null,
      loading: false,
      nested: { keys: { A: 'a', B: 'b' }, path: ['A', 'B'] },
      value: 'c',
    });
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
    };
    const result = getState(state, options);
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
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      loading: true,
      value: 'c',
      error: null,
      nested,
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
    };
    const result = getState(state, options);
    expect(result).toStrictEqual({
      loading: true,
      value: defaultValue,
      error: null,
      nested,
    });
  });

  it('should return the state manager format', () => {
    const result = getState(null);
    expect(result).toStrictEqual({
      loading: false,
      value: null,
      error: null,
      nested,
    });
  });
});
