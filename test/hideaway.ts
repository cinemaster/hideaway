import _ from 'lodash';
import { generateAction } from '../src/action';
import { HIDEAWAY, IHideawayAction } from '../src/contracts';
import {
  createMockStore,
  mockAPI,
  THideawayActionContent,
  triggerAction,
  TTestState,
} from './__ignore_tests__/common';

describe('middleware -> core -> highaway', () => {
  let dispatch;
  const type = 'TYPE_MOCK';

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('shoud dispatch the action request', async () => {
    const store = createMockStore();
    const expectAction: THideawayActionContent = {
      type: `${type}_REQUEST`,
    };
    const api = mockAPI();
    const action = generateAction(type, api);
    await triggerAction(action, store);
    expect(_.first(store.dispatchList)).toStrictEqual(expectAction);
  });

  it('shoud dispatch the action response', async () => {
    const store = createMockStore();
    const expectAction: THideawayActionContent = {
      type: `${type}_RESPONSE`,
      payload: '""',
    };
    const api = mockAPI();
    const action = generateAction(type, api);
    await triggerAction(action, store);
    expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
  });

  it('shoud dispatch the action error with response', async () => {
    const responseSetting = { status: 404 };
    const store = createMockStore();
    const api = mockAPI(responseSetting);
    const action = generateAction(type, api);
    await triggerAction(action, store);
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload?.status).toEqual(404);
  });

  it('shoud dispatch the action error with string', async () => {
    const reason = 'TypeError: Failed to fetch';
    const store = createMockStore();
    const api = () => Promise.reject(reason);
    const action = generateAction(type, api);
    await triggerAction(action, store);
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload).toEqual(reason);
  });

  it('shoud dispatch the action error with string and nested path', async () => {
    const reason = 'TypeError: Failed to fetch';
    const store = createMockStore();
    const api = () => Promise.reject(reason);
    const nested = {
      keys: { A: 'a' },
      path: ['A'],
    };
    const action = generateAction(type, api, { ...nested });
    await triggerAction(action, store);
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload).toEqual(reason);
    expect(result?.nested).toStrictEqual(nested);
  });

  it('shoud continue if predicate is true', async () => {
    const store = createMockStore();
    const api = mockAPI();
    const expectAction: THideawayActionContent = {
      type: `${type}_REQUEST`,
    };
    const predicate = () => true;
    const action = generateAction(type, api, { predicate });
    await triggerAction(action, store);
    expect(store.dispatchList[0]).toStrictEqual(expectAction);
  });

  it('shoud skip if predicate is false', async () => {
    const store = createMockStore();
    const api = mockAPI();
    const predicate = () => false;
    const action = generateAction(type, api, { predicate });
    await triggerAction(action, store);
    expect(store.dispatchList[0]).toStrictEqual(Promise.resolve());
  });

  it('shoud return a complement for request', async () => {
    const store = createMockStore();
    const complement = 'complementMock';
    const expectAction: THideawayActionContent = {
      type: `${type}_REQUEST`,
      complement,
    };
    const api = mockAPI();
    const action = generateAction(type, api, { complement });
    await triggerAction(action, store);
    expect(_.first(store.dispatchList)).toStrictEqual(expectAction);
  });

  it('shoud return a complement for response', async () => {
    const store = createMockStore();
    const complement = 'complementMock';
    const expectAction: THideawayActionContent = {
      type: `${type}_RESPONSE`,
      payload: '""',
      complement,
    };
    const api = mockAPI();
    const action = generateAction(type, api, { complement });
    await triggerAction(action, store);
    expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
  });

  it('shoud return a complement for error', async () => {
    const store = createMockStore();
    const complement = 'complementMock';
    const errorMessage = 'ERROR';
    const expectAction: THideawayActionContent = {
      type: `${type}_ERROR`,
      payload: errorMessage,
      complement,
    };
    const api = () => Promise.reject(errorMessage);
    const action = generateAction(type, api, { complement });
    await triggerAction(action, store);
    expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
  });

  it('shoud return keys with empty path', async () => {
    const store = createMockStore();
    const keys = { a: 1, b: 2 };
    const expectAction: THideawayActionContent = {
      type: `${type}_RESPONSE`,
      payload: '""',
      nested: {
        keys,
        path: [],
      },
    };
    const api = mockAPI();
    const action = generateAction(type, api, { keys });
    await triggerAction(action, store);
    expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
  });

  it('shoud return an error if does not send the api', async () => {
    const reason = new Error('API not set');
    const store = createMockStore();
    const action = { [HIDEAWAY]: { type } } as IHideawayAction<TTestState>;
    await triggerAction(action, store);
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload).toEqual(reason);
  });

  it('shoud ignore the action', async () => {
    const store = createMockStore();
    const expectAction: THideawayActionContent = { type: 'MOCK' };
    await triggerAction(expectAction, store);
    expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
  });

  it('shoud trigger the custom middleware onError', async () => {
    const onError = jest.fn();
    const responseSetting = { status: 404 };
    const store = createMockStore();
    const api = mockAPI(responseSetting);
    const action = generateAction(type, api);
    await triggerAction(action, store, { onError });
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload?.status).toEqual(404);
    expect(onError.mock.calls.length).toBe(1);
  });

  it('shoud trigger the custom action onError', async () => {
    const onError = jest.fn();
    const responseSetting = { status: 404 };
    const store = createMockStore();
    const api = mockAPI(responseSetting);
    const action = generateAction(type, api, { onError });
    await triggerAction(action, store);
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload?.status).toEqual(404);
    expect(onError.mock.calls.length).toBe(1);
  });
});
