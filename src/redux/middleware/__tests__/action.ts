import { API } from '../contracts';
import { generateApiAction } from '../action';
import { mockAPI } from './__ignore_tests__/common';

describe('middleware -> action -> generateApiAction', () => {
  it('shoud return the simple format', () => {
    const type = 'MOCK';
    const api = mockAPI();
    const result = generateApiAction(type, api);
    expect(result).toStrictEqual({
      [API]: {
        type,
        api,
        predicate: undefined,
      },
    });
  });

  it('should add more parameters to insert on action.', () => {
    const type = 'MOCK';
    const api = mockAPI();
    const actionAttributes = { mock: 'a' };
    const result = generateApiAction(type, api, {
      actionAttributes,
    });
    expect(result).toStrictEqual({
      [API]: {
        type,
        api,
        predicate: undefined,
        ...actionAttributes,
      },
    });
  });
});
