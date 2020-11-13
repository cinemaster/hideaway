import { AnyAction, Dispatch } from 'redux';

export const HIDEAWAY = Symbol('HIDEAWAY');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type THideawayAny = any;

export type THideawayAnyObject = {
  [key: string]: THideawayAny;
};

export type TFHideawayGetState<S> = () => S;

export type TFHideawayPredicate = <S>(
  getState: TFHideawayGetState<S>,
  withExtraArgument: THideawayAnyObject,
) => boolean;

/**
 * @template string URL wrong, CORS block, network error.
 * @template Response status code error.
 */
export type THideawayReason = string | Response;

export type THideawayAction<S = THideawayAny, DispatchExt = {}> =
  | AnyAction
  | IHideawayActionContent<S, DispatchExt>;

export type TFHideawayApi<S = THideawayAnyObject, DispatchExt = {}> = (
  dispatch: THideawayDispatch<S, DispatchExt>,
  getState: TFHideawayGetState<S>,
  withExtraArgument?: THideawayAnyObject,
) => typeof Promise.prototype;

export type TFHideawayApiPreReducer<S> = (body: S) => THideawayAny;

export type THideawayOnError<S, DispatchExt = {}> = (
  actionContent: IHideawayActionContent<THideawayAny, DispatchExt>,
  getState: TFHideawayGetState<S>,
  dispatch: THideawayDispatch<S, DispatchExt>,
  onError?: THideawayOnError<S, DispatchExt>,
  withExtraArgument?: THideawayAnyObject,
) => THideawayAny;

export type TFHideawayCombineShallow = (
  reducers: IHideawayActionReducer<THideawayAny>,
) => TFHideawayReducer;

export type TFGetPathDifference = (
  value: THideawayAny,
  path: string[],
) => THideawayAny;

export type TStateOrNull<S> = S | null;

export type THideawayNestedProps = IHideawayNestedProps | null;

export type TFHideawayReducer<S = THideawayAny> = (
  state: S,
  action: THideawayAction,
) => S;

export interface IHideawayActionReducer<S = THideawayAny> {
  [action: string]: TFHideawayReducer<S>;
}

export type THideawayCreateReducer<S = THideawayAny> = (
  initialState: S,
  reducers: IHideawayActionReducer<THideawayAny>,
) => TFHideawayReducer<S>;

export interface IHideawayStatusReducer extends IHideawayActionReducer {
  loading: TFHideawayReducer<boolean>;
  value: TFHideawayReducer;
  error: TFHideawayReducer;
}

export interface IHideawayAction<S = THideawayAnyObject, DispatchExt = {}>
  extends AnyAction {
  [HIDEAWAY]?: IHideawayActionContent<S, DispatchExt>;
}

export interface IHideawayStatusManager<R = THideawayAny, E = THideawayAny> {
  loading: boolean;
  value: R;
  error: E;
  nested?: IHideawayNestedProps;
}

export interface IHideawayStatusManagerOptions<
  R = THideawayAny,
  E = THideawayAny
> {
  loading?: boolean;
  value?: R;
  error?: E;
  nested?: IHideawayNestedProps;
}

/**
 * @template S The state expected to be used on reducer.
 * @param {string} type is the action name.
 * @param {TFHideawayApi<S>} api is a function that returns a promise. The
 * function receive (dispatch, getState, extra) from the middleware.
 * @param {TFHideawayApiPreReducer<S>} apiPreReducer receives the body after the
 * api call and expect a result that will send to the reducer.
 * @param {S} payload is the state expected to be used on reducer.
 * @param {IHideawayNestedProps} nested contains the keys and the path to update
 * the object.
 * @param {object} complement is an addition properties for the action, to be
 * used by the reducer.
 * @param {TFHideawayPredicate} predicate skip the fetch if predicate is false.
 * @param {THideawayOnError} onError is a custom error handler for api response.
 * @param {Response} response is the result of the api call. It not response if
 * it does not have status code. (e.g: Invalid url)
 * @param {boolean} isStateManager define how to handle the api request. The
 * default is true (It handles REQUEST, RESPONSE, ERROR).
 */
export interface IHideawayActionContent<S, DispatchExt = {}> extends AnyAction {
  api?: TFHideawayApi<S, DispatchExt>;
  apiPreReducer?: TFHideawayApiPreReducer<S>;
  payload?: S;
  nested?: IHideawayNestedProps;
  complement?: THideawayAny;
  predicate?: TFHideawayPredicate;
  onError?: THideawayOnError<S, DispatchExt>;
  response?: Response;
  isStateManager?: boolean;
}

/**
 * @param {TFHideawayApiPreReducer<S>} apiPreReducer receives the body after the
 * api call and expect a result that will send to the reducer.
 * @param {THideawayAnyObject} keys is used to generate the nest path; It can be
 * used for identification beyond the payload.
 * @param {string[]} path is used with keys to generate the nested path.
 * @param {boolean} allObject returns the object instead the value for nested
 * path.
 * @param {THideawayAny} complement is an addition properties for the action, to
 * be used inside the reducer.
 * @param {TFHideawayPredicate} predicate skip the fetch if predicate is false.
 * @param {THideawayOnError} onError is a custom error handler for api response.
 * @param {boolean} isStateManager define how to handle the api request. The
 * default is true (It handles REQUEST, RESPONSE, ERROR).
 * @param {S} payload is the state expected to be used on reducer.
 */
export interface IHideawayActionOptions<S = THideawayAny> {
  apiPreReducer?: TFHideawayApiPreReducer<S>;
  keys?: THideawayAnyObject;
  path?: string[];
  allObject?: boolean;
  complement?: THideawayAny;
  predicate?: TFHideawayPredicate;
  onError?: THideawayOnError<S>;
  isStateManager?: boolean;
  payload?: S;
}

/**
 * @template S The state expected to be used on reducer.
 * @param initialState is the initial state for the reducer.
 * @param {IHideawayActionReducer<S>} reducers is a object that contains a set
 * of actions as keys, and reducers as values.
 * @param isStateManager change the state to use loading, value, and error.
 * @param isNested enable the state to store a nested path. Required nested
 * attribute.
 * @param hasNested It doens't enable the nested path but store it with the
 * state.
 * @param {IHideawayNestedProps} nested contains the keys and the path to update
 * the object.
 * @param displayError display a console error if failed to fetch.
 */
export interface IHideawayReducerOptions<S> {
  displayError?: boolean;
  initialState?: S | null;
  nested?: IHideawayNestedProps;
  isNested?: boolean;
  hasNested?: boolean;
  isStateManager?: boolean;
  reducers?: IHideawayActionReducer<S>;
}

/**
 * @param {string[]} path location of the requested state.
 * @param {any} defaultValue value to return if doesn't find the path.
 * (default: undefined)
 * @param {IHideawayNestedProps} nested contains the keys and the path to
 * retrieve the value from the nested path.
 * @param {boolean} isStateManager inform to return the loading, value and error
 * when the result is empty or null.
 */
export interface IHideawaySelectorOptions {
  path?: string[];
  defaultValue?: THideawayAny;
  nested?: IHideawayNestedProps;
  isStateManager?: boolean;
}

export interface IHideawayOptions<S, DispatchExt> {
  onError?: THideawayOnError<S, DispatchExt>;
  withExtraArgument?: THideawayAnyObject;
}

/**
 * @param {THideawayAnyObject} keys is used to generate the nest path; It can be used for identification beyond the payload
 * @param {string[]} path is used with keys to generate the nested path.
 */
export interface IHideawayNestedProps {
  keys: THideawayAnyObject;
  path: string[];
  allObject?: boolean;
}

export interface IHideawayCombineOptions {
  ignoreCheck: boolean;
}

// ******* THUNK *******
export type THideawayDispatch<S, DispatchExt> = Dispatch &
  IThunkDispatch<S, DispatchExt> &
  DispatchExt;

export interface IThunk<R, S, DispatchExt = {}> {
  (
    dispatch: THideawayDispatch<S, DispatchExt>,
    getState: TFHideawayGetState<S>,
  ): R;
}

export interface IThunkDispatch<S, DispatchExt = {}> {
  <R>(thunk: IThunk<R, S, DispatchExt>): R;
}

export type TFGetValue = <R = THideawayAny, S = THideawayAny>(
  state: S,
  options?: IHideawaySelectorOptions,
) => R;

export type TFGetState = <R = THideawayAny, S = THideawayAny>(
  state: S,
  options?: IHideawaySelectorOptions,
) => IHideawayStatusManager<R>;
