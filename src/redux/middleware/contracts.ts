import { AnyAction, Action, Dispatch, MiddlewareAPI, Middleware } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type THideawayAny = any;

export type THideawayAnyObject = {
  [key: string]: THideawayAny;
};

export type DispatchExt = {};

// ########## Middleware ##########
export type THideawayMiddleware<
  S = {},
  A extends Action = AnyAction,
  E = undefined
> = Middleware<ThunkDispatch<S, E, A>, S, ThunkDispatch<S, E, A>>;

export type THideawayMiddlewareAPI<S, DispatchExt> = MiddlewareAPI<
  THideawayDispatch<S, DispatchExt>,
  S
>;

// ########## Action ##########
export const API = Symbol('API');

export type THideawayApiFunction = () => typeof Promise.prototype;

export type TFHideawayPredicate<S> = (getState: () => S) => boolean;

export interface IHideawayAction<S> extends Action<string> {
  [API]?: IHideawayApiTemplateAction<S>;
  payload?: S;
  [key: string]: THideawayAny;
}

/**
 * @param {object} keys is used to generate the nest path; It can be used for identification beyond the payload
 * @param {object} actionAttributes is an addition properties for the action.
 * @param {TFHideawayPredicate} predicate skip the fetch if predicate is false
 */
export interface IHideawayGenerateApiOptions<S> {
  keys?: object;
  actionAttributes?: object;
  predicate?: TFHideawayPredicate<S>;
}

/**
 * @param {string} type is the action name.
 * @param {object} keys is used to generate the nest path; It can be used for identification beyond the payload
 * @param {object} actionAttributes is an addition properties for the action.
 * @param {TFHideawayPredicate} predicate skip the fetch if predicate is false
 */
export interface IHideawayApiTemplateAction<S> {
  type: string;
  api: THideawayApiFunction;
  keys?: THideawayAnyObject;
  predicate?: TFHideawayPredicate<S>;
}

// ########## Dispatch ##########
// (action) => R or (thunk) => R
export type THideawayDispatch<S, DispatchExt = {}> = Dispatch &
  IHideawayThunkDispatch<S, DispatchExt>;

// ########## Reducers ##########
// State for items with isStateManager is true
export interface IHideawayReducerState<S> {
  loading?: boolean;
  value?: S;
  error?: THideawayAny;
}

// Mix state and state manager
export type THideawayReduserState<S> = S & IHideawayReducerState<S>;

export type TReducer<S> = (state: S, action: IHideawayAction<S>) => S;

export interface IActionReducer<S = THideawayAny> {
  [action: string]: TReducer<S>;
}

export interface IHideawayReducerOptions<S> {
  initialState?: S;
  reducers?: IActionReducer<S>;
  isStateManager?: boolean;
}

// ########## Selectors ##########
/**
 * @param {string[]} path location of the requested state.
 * @param {any} defaultValue value to return if doesn't find the path (default: undefined).
 */
export interface IHideawaySelectorOptions<S> {
  path?: string[];
  defaultValue?: THideawayAny;
}

// ########## Thunk ##########
export interface IHideawayThunkDispatch<S, DispatchExt = {}> {
  <R>(thunk: IHideawayThunk<R, S, DispatchExt>): R;
}

export interface IHideawayThunk<R, S, DispatchExt = {}> {
  (
    dispatch: Dispatch & IHideawayThunkDispatch<S, DispatchExt>,
    getState: () => S,
  ): R;
}
