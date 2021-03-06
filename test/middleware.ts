import _ from 'lodash';
import { generateAction, generateStateManagerAction } from '../src/action';
import {
  HIDEAWAY,
  IHideawayAction,
  IHideawayActionContent,
  IHideawayNestedProps,
  TFHideawayApi,
  TFHideawayPredicate,
  THideawayReason,
} from '../src/contracts';
import {
  createMockStore,
  mockAPI,
  ResponseMock,
  THideawayActionContent,
  triggerAction,
  TTestState,
} from './__ignore_tests__/common';

describe('middleware -> core -> highaway', () => {
  const type = 'TYPE_MOCK';

  describe('general', () => {
    it('shoud ignore the action', async () => {
      const store = createMockStore();
      const expectAction: THideawayActionContent = { type: 'MOCK' };
      await triggerAction(expectAction, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud skip if does not send the api', async () => {
      const store = createMockStore();
      const action = { [HIDEAWAY]: { type } } as IHideawayAction<TTestState>;
      await triggerAction(action, store);
      const result = _.last(store.dispatchList);
      expect(result).toEqual(Promise.resolve());
    });

    it('shoud skip if predicate is false', async () => {
      const store = createMockStore();
      const api = mockAPI();
      const predicate = () => false;
      const action = generateAction(type, api, { predicate });
      await triggerAction(action, store);
      expect(store.dispatchList[0]).toStrictEqual(Promise.resolve());
    });

    it('shoud continue if predicate is true', async () => {
      const store = createMockStore();
      const api = mockAPI({ body: 'OK' });
      const expectAction: THideawayActionContent = { type, payload: 'OK' };
      const predicate = () => true;
      const action = generateAction(type, api, { predicate });
      await triggerAction(action, store);
      expect(store.dispatchList[1]).toStrictEqual(expectAction);
    });

    it('shoud receive extra arguments for predicate', async () => {
      const extraArgs = { OK: 1 };
      const store = createMockStore();
      const api = mockAPI({ body: 'OK' });
      const expectAction: THideawayActionContent = { type, payload: 'OK' };
      const predicate: TFHideawayPredicate = (getState, withExtraArgs) => {
        expect(typeof getState === 'function').toBeTruthy();
        expect(withExtraArgs).toStrictEqual(extraArgs);
        return true;
      };
      const action = generateAction(type, api, { predicate });
      await triggerAction(action, store, { withExtraArgument: extraArgs });
      expect(store.dispatchList[1]).toStrictEqual(expectAction);
    });

    it('shoud ignore if action is an empty object', async () => {
      const store = createMockStore();
      const expectAction = {};
      const action = {};
      await triggerAction(action as IHideawayActionContent<{}>, store);
      expect(_.first(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud ignore if action is undefined', async () => {
      const store = createMockStore();
      const expectAction = undefined;
      const action = undefined;
      await triggerAction(
        (action as unknown) as IHideawayActionContent<{}>,
        store,
      );
      expect(_.first(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud not throw an error for 204 (No Content)', async () => {
      const store = createMockStore();
      class Response extends ResponseMock {} // Simulate Response class
      const response = new Response({ ok: true, status: 204, body: '' });
      const api = jest.fn();
      api.mockReturnValue(Promise.resolve(response));
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual({
        type: `${type}_RESPONSE`,
        payload: '',
      });
    });

    it('shoud receive an string for no content-type different from application/json', async () => {
      const extraArgs = { OK: 1 };
      const store = createMockStore();
      const expectBody = '{"a":1}';
      const api = mockAPI({ body: expectBody });
      const expectAction: THideawayActionContent = {
        type,
        payload: expectBody,
      };
      const action = generateAction(type, api);
      await triggerAction(action, store, { withExtraArgument: extraArgs });
      expect(store.dispatchList[1]).toStrictEqual(expectAction);
    });

    it('shoud receive an object for content-type = application/json', async () => {
      const extraArgs = { OK: 1 };
      const store = createMockStore();
      const expectBody = { a: 1 };
      const api = mockAPI({
        body: expectBody,
        headers: new Headers({ 'content-type': 'application/json' }),
      });
      const expectAction: THideawayActionContent = {
        type,
        payload: expectBody,
      };
      const action = generateAction(type, api);
      await triggerAction(action, store, { withExtraArgument: extraArgs });
      expect(store.dispatchList[1]).toStrictEqual(expectAction);
    });
  });

  describe('Api without state manager', () => {
    it('shoud call the error with the action payload in a response action', async () => {
      const store = createMockStore();
      class Response extends ResponseMock {} // Simulate Response class
      const response = new Response({ ok: false, status: 404, body: 'error' });
      const api = jest.fn();
      api.mockReturnValue(Promise.resolve(response));
      const onError = (action: IHideawayActionContent<THideawayReason>) => {
        expect(action.type).toEqual(type);
        expect(action.payload).toBe('error');
      };
      const action = generateAction(type, api, { onError });
      await triggerAction(action, store);
    });

    it('shoud call the error with the action payload with response', async () => {
      const responseSetting = { status: 404 };
      const store = createMockStore();
      const api = mockAPI(responseSetting);
      const onError = (action: IHideawayActionContent<THideawayReason>) =>
        expect(action.payload).toBeInstanceOf(ResponseMock);
      const action = generateAction(type, api, { onError });
      await triggerAction(action, store);
    });

    it('shoud call the error with the action payload with string', async () => {
      const reason = 'TypeError: Failed to fetch';
      const store = createMockStore();
      const api = () => Promise.reject(reason);
      const onError = (action: IHideawayActionContent<THideawayReason>) =>
        expect(action.payload).toBe(reason);
      const action = generateAction(type, api, { onError });
      await triggerAction(action, store);
    });

    it('shoud call the error with the action with complement', async () => {
      const reason = 'TypeError: Failed to fetch';
      const store = createMockStore();
      const complement = { OK: 1 };
      const api = () => Promise.reject(reason);
      const onError = (action: IHideawayActionContent<THideawayReason>) =>
        expect(action.complement).toStrictEqual(complement);
      const action = generateAction(type, api, { onError, complement });
      await triggerAction(action, store);
    });

    it('shoud send nested attribute to the error method', async () => {
      const reason = 'TypeError: Failed to fetch';
      const store = createMockStore();
      const api = () => Promise.reject(reason);
      const onError = (action: IHideawayActionContent<THideawayReason>) =>
        expect(action.nested).toBeDefined();
      const nested: IHideawayNestedProps = {
        keys: { A: 'a' },
        path: ['A'],
      };
      const action = generateAction(type, api, { ...nested, onError });
      await triggerAction(action, store);
    });

    it('shoud return a complement for response', async () => {
      const store = createMockStore();
      const complement = 'complementMock';
      const expectAction: THideawayActionContent = {
        type,
        payload: '',
        complement,
      };
      const api = mockAPI();
      const action = generateAction(type, api, { complement });
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud not make any action for error', async () => {
      const store = createMockStore();
      const api = () => Promise.reject('ERROR');
      const action = generateAction(type, api);
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(Promise.resolve());
    });

    it('shoud return keys with empty path', async () => {
      const store = createMockStore();
      const keys = { a: 1, b: 2 };
      const expectAction: THideawayActionContent = {
        type,
        payload: '',
        nested: {
          keys,
          path: [],
          allObject: undefined,
        },
      };
      const api = mockAPI();
      const action = generateAction(type, api, { keys });
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud trigger the custom middleware onError', async () => {
      const onError = jest.fn();
      const store = createMockStore();
      const api = mockAPI({ status: 404 });
      const action = generateAction(type, api);
      await triggerAction(action, store, { onError });
      expect(onError.mock.calls.length).toBe(1);
    });

    it('shoud trigger the custom action onError', async () => {
      const onError = jest.fn();
      const store = createMockStore();
      const api = mockAPI({ status: 404 });
      const action = generateAction(type, api, { onError });
      await triggerAction(action, store);
      expect(onError.mock.calls.length).toBe(1);
    });

    it('shoud send additional arguments (middleware)', async () => {
      const store = createMockStore();
      const expectAction: THideawayActionContent = { type, payload: '' };
      const arg = { OK: 1 };
      const api: TFHideawayApi = (_dispatch, _getState, withExtraArgument) => {
        expect(withExtraArgument).toStrictEqual(arg);
        return Promise.resolve(new ResponseMock({ body: '' }));
      };
      const action = generateAction(type, api);
      await triggerAction(action, store, { withExtraArgument: arg });
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud run the apiPreReducer', async () => {
      const store = createMockStore();
      const api = mockAPI();
      const text = 'Mock';
      const apiPreReducer = () => text;
      const expectAction: THideawayActionContent = { type, payload: text };
      const action = generateAction(type, api, { apiPreReducer });
      await triggerAction(action, store);
      expect(store.dispatchList[1]).toStrictEqual(expectAction);
    });
  });

  describe('Api with state manager', () => {
    it('shoud dispatch the action request', async () => {
      const store = createMockStore();
      const expectAction: THideawayActionContent = {
        type: `${type}_REQUEST`,
      };
      const api = mockAPI();
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store);
      expect(_.first(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud dispatch the action response', async () => {
      const store = createMockStore();
      const expectAction: THideawayActionContent = {
        type: `${type}_RESPONSE`,
        payload: '',
      };
      const api = mockAPI();
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud dispatch the action error with response', async () => {
      const store = createMockStore();
      class Response extends ResponseMock {} // Simulate Response class
      const response = new Response({ ok: false, status: 404 });
      const api = jest.fn();
      api.mockReturnValue(Promise.reject(response));
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store);
      const result = _.last(store.dispatchList);
      expect(result?.type).toEqual(`${type}_ERROR`);
      expect(result?.payload).toBe(response);
    });

    it('shoud dispatch the action error in a response action', async () => {
      const responseSetting = { status: 404 };
      const store = createMockStore();
      const api = mockAPI(responseSetting);
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store);
      const result = _.last(store.dispatchList);
      expect(result?.type).toEqual(`${type}_ERROR`);
      expect(result?.payload?.status).toEqual(404);
    });

    it('shoud dispatch the action error with string', async () => {
      const reason = 'TypeError: Failed to fetch';
      const store = createMockStore();
      const api = () => Promise.reject(reason);
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store);
      const result = _.last(store.dispatchList);
      expect(result?.type).toEqual(`${type}_ERROR`);
      expect(result?.payload).toEqual(reason);
    });

    it('shoud dispatch the action error with string and nested path', async () => {
      const reason = 'TypeError: Failed to fetch';
      const store = createMockStore();
      const api = () => Promise.reject(reason);
      const nested: IHideawayNestedProps = {
        keys: { A: 'a' },
        path: ['A'],
        allObject: undefined,
      };
      const action = generateStateManagerAction(type, api, { ...nested });
      await triggerAction(action, store);
      const result = _.last(store.dispatchList);
      expect(result?.type).toEqual(`${type}_ERROR`);
      expect(result?.payload).toEqual(reason);
      expect(result?.nested).toStrictEqual(nested);
    });

    it('shoud return a complement for request', async () => {
      const store = createMockStore();
      const complement = 'complementMock';
      const expectAction: THideawayActionContent = {
        type: `${type}_REQUEST`,
        complement,
      };
      const api = mockAPI();
      const action = generateStateManagerAction(type, api, { complement });
      await triggerAction(action, store);
      expect(_.first(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud return a complement for response', async () => {
      const store = createMockStore();
      const complement = 'complementMock';
      const expectAction: THideawayActionContent = {
        type: `${type}_RESPONSE`,
        payload: '',
        complement,
      };
      const api = mockAPI();
      const action = generateStateManagerAction(type, api, { complement });
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud not return a complement for error', async () => {
      const store = createMockStore();
      const complement = 'complementMock';
      const errorMessage = 'ERROR';
      const expectAction: THideawayActionContent = {
        type: 'TYPE_MOCK_ERROR',
        payload: 'ERROR',
      };
      const api = () => Promise.reject(errorMessage);
      const action = generateStateManagerAction(type, api, { complement });
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud return keys with empty path', async () => {
      const store = createMockStore();
      const keys = { a: 1, b: 2 };
      const expectAction: THideawayActionContent = {
        type: `${type}_RESPONSE`,
        payload: '',
        nested: {
          keys,
          path: [],
          allObject: undefined,
        },
      };
      const api = mockAPI();
      const action = generateStateManagerAction(type, api, { keys });
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud trigger the custom middleware onError', async () => {
      const onError = jest.fn();
      const store = createMockStore();
      const api = mockAPI({ status: 404 });
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store, { onError });
      const result = _.last(store.dispatchList);
      expect(result?.type).toEqual(`${type}_ERROR`);
      expect(result?.payload?.status).toEqual(404);
      expect(onError.mock.calls.length).toBe(1);
    });

    it('shoud trigger the custom action onError', async () => {
      const onError = jest.fn();
      const store = createMockStore();
      const api = mockAPI({ status: 404 });
      const action = generateStateManagerAction(type, api, { onError });
      await triggerAction(action, store);
      const result = _.last(store.dispatchList);
      expect(result?.type).toEqual(`${type}_ERROR`);
      expect(result?.payload?.status).toEqual(404);
      expect(onError.mock.calls.length).toBe(1);
    });

    it('shoud return the result of onError to the payload', async () => {
      const expected = { RESULT: 'OK' };
      const onError = () => expected;
      const store = createMockStore();
      const api = mockAPI({ status: 404 });
      const action = generateStateManagerAction(type, api, { onError });
      await triggerAction(action, store);
      const result = _.last(store.dispatchList);
      expect(result?.type).toEqual(`${type}_ERROR`);
      expect(result?.payload).toStrictEqual(expected);
    });

    it('shoud send additional arguments (middleware)', async () => {
      const store = createMockStore();
      const expectAction: THideawayActionContent = {
        type: `${type}_RESPONSE`,
        payload: '',
      };
      const arg = { OK: 1 };
      const api: TFHideawayApi = (_dispatch, _getState, withExtraArgument) => {
        expect(withExtraArgument).toStrictEqual(arg);
        return Promise.resolve(new ResponseMock({ body: '' }));
      };
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store, { withExtraArgument: arg });
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud run the apiPreReducer', async () => {
      const store = createMockStore();
      const api = mockAPI();
      const text = 'Mock';
      const apiPreReducer = () => text;
      const expectAction: THideawayActionContent = {
        type: `${type}_RESPONSE`,
        payload: text,
      };
      const action = generateStateManagerAction(type, api, { apiPreReducer });
      await triggerAction(action, store);
      expect(store.dispatchList[2]).toStrictEqual(expectAction);
    });
  });

  describe('Using environment variable (HIDEAWAY_STATE_MANAGER)', () => {
    it('shoud dispatch the action request', async () => {
      const store = createMockStore();
      const expectAction: THideawayActionContent = {
        type,
        payload: '',
      };
      const api = mockAPI();
      const action = generateAction(type, api);
      await triggerAction(action, store);
      expect(_.last(store.dispatchList)).toStrictEqual(expectAction);
    });

    it('shoud dispatch the action request', async () => {
      const store = createMockStore();
      const expectAction: THideawayActionContent = {
        type: `${type}_REQUEST`,
      };
      const api = mockAPI();
      const action = generateStateManagerAction(type, api);
      await triggerAction(action, store);
      expect(_.first(store.dispatchList)).toStrictEqual(expectAction);
    });
  });
});
