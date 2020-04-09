import { Action } from 'redux';
import {
  THideawayAction,
  THideawayDispatch,
  THideawayMiddlewareAPI,
} from '../../contracts';
import { hideaway } from '../../core';

export type TTestState = {};

export interface ResponseProps {
  headers?: object;
  ok?: boolean;
  redirected?: boolean;
  status?: number;
  statusText?: string;
  type?: ResponseType;
  url?: string;
  body?: any | null; // ReadableStream<Uint8Array> | null;
  bodyUsed?: boolean;
}

export class ResponseMock {
  headers: object; // Headers
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  body: ReadableStream<Uint8Array> | null;
  bodyUsed: boolean;

  constructor(props: ResponseProps = {}) {
    this.headers = props.headers || {};
    this.status = props.status || 200;
    this.ok = props.ok || this.status === 200;
    this.redirected = props.redirected || this.status === 302;
    this.statusText = props.statusText || 'OK';
    this.type = props.type || 'basic';
    this.url = props.url || 'http://localhost';
    this.body = props.body;
    this.bodyUsed = props.bodyUsed || this.body !== null;
  }

  arrayBuffer: () => Promise<ArrayBuffer> = () =>
    Promise.resolve(new ArrayBuffer(1978));

  blob: () => Promise<Blob> = () => Promise.resolve(new Blob());

  formData: () => Promise<FormData> = () => Promise.resolve(new FormData());

  json: () => Promise<any> = () => {
    const body = this.body || '';
    return Promise.resolve(JSON.stringify(body));
  };

  text: () => Promise<string> = () => Promise.resolve('');
}

export const mockAPI = (obj?: ResponseProps) => {
  const response = new ResponseMock(obj);
  const api = jest.fn();
  api.mockReturnValue(Promise.resolve(response));
  return api;
};

export class StoreMock<S, DispatchExt = {}> {
  dispatchList: THideawayAction<S>[] = [];
  data = {};

  dispatch: THideawayDispatch<S, DispatchExt> = (value: any) => {
    let result = value;
    if (typeof value === 'function') {
      result = value(this.dispatch, this.getState);
    }
    this.dispatchList.push(result);
    return result;
  };

  getState: () => S = () => this.data as S;
}

export const triggerAction = <S = TTestState>(
  action: THideawayAction<S>,
  store?: StoreMock<S>,
) => {
  const storeObj = store || new StoreMock<S>();

  const middlewareAPI: THideawayMiddlewareAPI<S, {}> = {
    getState: storeObj.getState,
    dispatch: (action: Action) => storeObj.dispatch(action),
  };

  const middleware = hideaway<TTestState, {}>();

  const hideawayResult = middleware(middlewareAPI)(storeObj.dispatch);
  return hideawayResult(action);
};
