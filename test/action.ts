import { generateAction } from '../src/action';
import {
  HIDEAWAY,
  IHideawayActionContent,
  TFHideawayApi,
  THideawayAny,
} from '../src/contracts';
import { mockAPI } from './__ignore_tests__/common';

describe('action -> generateApiAction', () => {
  const type = 'MOCK';
  const keys = { mock: 'a' };
  const api = (mockAPI() as unknown) as TFHideawayApi;

  it('shoud return the simple format', () => {
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
    };
    const result = generateAction(type, api);
    expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
  });

  it('should add the complement attribute', () => {
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      complement: keys,
    };
    const result = generateAction(type, api, { complement: keys });
    expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
  });

  it('should add the key attribute', () => {
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      nested: {
        keys,
        path: [],
        allObject: undefined,
      },
    };
    const result = generateAction(type, api, { keys });
    expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
  });

  it('should be true for allObject', () => {
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      nested: {
        keys,
        path: [],
        allObject: true,
      },
    };
    const result = generateAction(type, api, { keys, allObject: true });
    expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
  });

  it('should add the predicate attribute', () => {
    const predicate = () => true;
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      predicate,
    };
    const result = generateAction(type, api, { predicate });
    expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
  });

  it('should add the onError attribute', () => {
    const onError = () => {};
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      api,
      onError,
    };
    const result = generateAction(type, api, { onError });
    expect(result).toStrictEqual({ type, [HIDEAWAY]: APIContent });
  });

  it('should create an action without api', () => {
    const APIContent: IHideawayActionContent<THideawayAny> = {
      type,
      nested: {
        keys,
        path: [],
        allObject: true,
      },
    };
    const result = generateAction(type, undefined, { keys, allObject: true });
    expect(result).toStrictEqual(APIContent);
  });

  it('should send the payload', () => {
    const payload = keys;
    const result = generateAction(type, undefined, {
      keys,
      allObject: true,
      payload,
    });
    expect(result.payload).toStrictEqual(keys);
  });

  it('should ignore the apiPreReducer without api', () => {
    const apiPreReducer = () => 'mock';
    const result = generateAction(type, undefined, {
      keys,
      apiPreReducer,
    });
    expect(result.apiPreReducer).toBeUndefined();
  });

  it('should send the apiPreReducer', () => {
    const apiPreReducer = () => 'mock';
    const result = generateAction(type, api, {
      keys,
      apiPreReducer,
    });
    expect(result[HIDEAWAY]?.apiPreReducer).toEqual(apiPreReducer);
  });
});
