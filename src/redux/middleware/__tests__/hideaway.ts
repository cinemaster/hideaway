import _ from 'lodash';
import { generateApiAction } from '../action';
import {
  mockAPI,
  StoreMock,
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
    const store = new StoreMock<TTestState>();
    const api = mockAPI();
    const action = generateApiAction(type, api);
    await triggerAction(action, store);
    expect(_.first(store.dispatchList)).toStrictEqual({
      type: `${type}_REQUEST`,
    });
  });

  it('shoud dispatch the action response', async () => {
    const store = new StoreMock<TTestState>();
    const api = mockAPI();
    const action = generateApiAction(type, api);
    await triggerAction(action, store);
    expect(_.last(store.dispatchList)).toStrictEqual({
      type: `${type}_RESPONSE`,
      payload: '""',
    });
  });

  it('shoud dispatch the action error with response', async () => {
    const responseSetting = { status: 404 };
    const store = new StoreMock<TTestState>();
    const api = mockAPI(responseSetting);
    const action = generateApiAction(type, api);
    await triggerAction(action, store);
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload?.status).toEqual(404);
  });

  it('shoud dispatch the action error with string', async () => {
    const reason = 'TypeError: Failed to fetch';
    const store = new StoreMock<TTestState>();
    const api = () => Promise.reject(reason);
    const action = generateApiAction(type, api);
    await triggerAction(action, store);
    const result = _.last(store.dispatchList);
    expect(result?.type).toEqual(`${type}_ERROR`);
    expect(result?.payload).toEqual(reason);
  });

  it('shoud continue if predicate is true', async () => {
    const store = new StoreMock<TTestState>();
    const api = mockAPI();
    const predicate = () => true;
    const action = generateApiAction(type, api, {
      predicate,
    });
    await triggerAction(action, store);
    expect(store.dispatchList[0]).toStrictEqual({
      type: `${type}_REQUEST`,
    });
  });

  it('shoud skip if predicate is true', async () => {
    const store = new StoreMock<TTestState>();
    const api = mockAPI();
    const predicate = () => false;
    const action = generateApiAction(type, api, {
      predicate,
    });
    await triggerAction(action, store);
    expect(store.dispatchList[0]).toStrictEqual(Promise.resolve());
  });
});
