import { AnyAction, Dispatch, MiddlewareAPI, Store } from 'redux';
import {
  IHideawayActionContent,
  IHideawayOptions,
  THideawayAny,
  THideawayAnyObject,
  THideawayDispatch,
} from '../../src/contracts';
import { hideaway } from '../../src/middleware';

export type TTestState = THideawayAny;

export type THideawayActionContent = IHideawayActionContent<TTestState>;

export interface ResponseProps {
  headers?: Headers;
  ok?: boolean;
  redirected?: boolean;
  status?: number;
  statusText?: string;
  type?: ResponseType;
  url?: string;
  body?: any | null;
  bodyUsed?: boolean;
}

export interface MockStore extends Store {
  dispatchList: THideawayAny[];
  data: THideawayAnyObject;
}

export class ResponseMock {
  headers: Headers;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  body: ReadableStream<Uint8Array> | null;
  bodyUsed: boolean;

  constructor(props: ResponseProps = {}) {
    this.headers = new Headers(props.headers);
    this.status = props.status || 200;
    this.ok = props.ok || this.status === 200;
    this.redirected = props.redirected || this.status === 302;
    this.statusText = props.statusText || 'OK';
    this.type = props.type || 'basic';
    this.url = props.url || 'http://localhost';
    this.body =
      typeof props.body === 'string'
        ? props.body
        : (JSON.stringify(props.body) as any) || '';
    this.bodyUsed = props.bodyUsed || this.body !== null;
  }

  json: () => Promise<any> = () => {
    const body = this.body || '""';
    try {
      return Promise.resolve(JSON.parse(body as string));
    } catch {
      return Promise.resolve(body);
    }
  };

  text: () => Promise<string> = () =>
    Promise.resolve(((this.body as unknown) as string) || '');
}

export const mockAPI = (obj?: ResponseProps) => {
  const response = new ResponseMock(obj);
  const api = jest.fn();
  api.mockReturnValue(Promise.resolve(response));
  return api;
};

export const createMockStore = (): MockStore => {
  const dispatchList = [] as THideawayAny[];
  const data: THideawayAnyObject = {};
  const getState = () => data;
  const dispatch: Dispatch<AnyAction> = (action) => {
    let result = action;
    if (typeof action === 'function') {
      result = (action as Function)(dispatch, getState);
    }
    dispatchList.push(result);
    return result;
  };
  return ({
    dispatchList,
    data,
    dispatch,
    getState,
  } as unknown) as MockStore;
};

export const triggerAction = <S = TTestState, Dispatch = {}>(
  action: IHideawayActionContent<S>,
  store?: MockStore,
  options?: IHideawayOptions<S, Dispatch>,
) => {
  const storeObj = store || createMockStore();

  const middleware = hideaway<TTestState, Dispatch>(options);

  const middlewareAPI = (storeObj as unknown) as MiddlewareAPI<
    THideawayDispatch<any, Dispatch>,
    any
  >;

  const hideawayResult = middleware(middlewareAPI)(storeObj.dispatch);
  return hideawayResult(action);
};

export const hideConsoleError = (consoleMock = jest.fn()) => {
  const originalConsole = console.error;
  console.error = consoleMock;
  return originalConsole;
};

export const restoreConsoleError = (originalConsole: any) => {
  console.error = originalConsole;
};

export const hideConsoleWarn = (consoleMock = jest.fn()) => {
  const originalConsole = console.warn;
  console.warn = consoleMock;
  return originalConsole;
};

export const restoreConsoleWarn = (originalConsole: any) => {
  console.warn = originalConsole;
};
