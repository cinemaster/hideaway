import { generateAction } from '../src/action';
import {
  HIDEAWAY,
  IHideawayActionContent,
  TFHideawayApi,
  THideawayAny,
} from '../src/contracts';
import { mockAPI } from './__ignore_tests__/common';

describe('middleware -> action -> generateApiAction', () => {
  it('shoud return the simple format', () => {
    const type = 'MOCK';
    const api = (mockAPI() as unknown) as TFHideawayApi;
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
    };
    const result = generateAction(type, api);
    expect(result).toStrictEqual({ [HIDEAWAY]: APIContent });
  });

  it('should add one more parameters to action.', () => {
    const type = 'MOCK';
    const complement = { mock: 'a' };
    const api = (mockAPI() as unknown) as TFHideawayApi;
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      complement,
    };
    const result = generateAction(type, api, { complement });
    expect(result).toStrictEqual({ [HIDEAWAY]: APIContent });
  });

  it('should add key parameters to action.', () => {
    const type = 'MOCK';
    const keys = { mock: 'a' };
    const api = (mockAPI() as unknown) as TFHideawayApi;
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      nested: {
        keys,
        path: [],
      },
    };
    const result = generateAction(type, api, { keys });
    expect(result).toStrictEqual({ [HIDEAWAY]: APIContent });
  });

  it('should add predicate to action.', () => {
    const type = 'MOCK';
    const predicate = () => true;
    const api = (mockAPI() as unknown) as TFHideawayApi;
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      predicate,
    };
    const result = generateAction(type, api, { predicate });
    expect(result).toStrictEqual({ [HIDEAWAY]: APIContent });
  });

  it('should add onError to action.', () => {
    const type = 'MOCK';
    const onError = () => {};
    const api = (mockAPI() as unknown) as TFHideawayApi;
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      onError,
    };
    const result = generateAction(type, api, { onError });
    expect(result).toStrictEqual({ [HIDEAWAY]: APIContent });
  });
});
