import { always, identity } from 'ramda';
import {
  IHideawayActionContent,
  IHideawayActionReducer,
  IHideawayNestedProps,
  IHideawayStatusManager,
  IHideawayStatusManagerOptions,
  IHideawayStatusReducer,
  TFHideawayApi,
  TFHideawayGetState,
  TFHideawayReducer,
  THideawayAny,
  THideawayAnyObject,
  THideawayDispatch,
  THideawayNestedProps,
  THideawayOnError,
  THideawayReason,
} from './contracts';
import { combineShallow, compose, createReducer, isObject } from './utils';

export const removeState = (type: string) => {
  if (!type) return type;
  return type.replace(/_(REQUEST|RESPONSE|ERROR)$/g, '');
};

export const hasStateObject = (value: THideawayAny) => {
  if (!isObject(value)) {
    return false;
  }
  const keyList = Object.keys(value);
  return ['loading', 'value', 'error'].every((key) => keyList.includes(key));
};

export const createStateManager = <R = THideawayAny, E = THideawayAny>(
  values: IHideawayStatusManagerOptions<R, E>,
) => {
  return {
    loading: false,
    value: null,
    error: null,
    ...values,
  } as IHideawayStatusManager<R, E>;
};

export const validateStateManager = (
  value: THideawayAny,
  nested?: IHideawayNestedProps,
) => {
  if (hasStateObject(value)) {
    return value;
  }
  return createStateManager({
    value,
    ...(nested && { nested }),
  });
};

export const generateStatusReducer = (
  prefix: string,
  reducer: TFHideawayReducer,
  hasNested: boolean = false,
  displayError: boolean = false,
) => {
  const loadingReducer: IHideawayActionReducer<boolean> = {
    [`${prefix}_REQUEST`]: always(true),
    [`${prefix}_RESPONSE`]: always(false),
    [`${prefix}_ERROR`]: always(false),
  };
  const valueReducer: IHideawayActionReducer<THideawayAny> = {
    [`${prefix}_RESPONSE`]: reducer,
    [`${prefix}_ERROR`]: () => null,
  };
  const errorReducer: IHideawayActionReducer<THideawayAny> = {
    [`${prefix}_ERROR`]: (_state, { payload }) => {
      if (payload instanceof Error) {
        if (displayError) console.trace(payload);
        return payload.toString();
      }
      return payload;
    },
    [`${prefix}_RESPONSE`]: always(null),
  };
  const nestedReducer: IHideawayActionReducer<THideawayNestedProps> = {
    [`${prefix}_REQUEST`]: (_state, action) => action.nested,
  };
  const nested = createReducer<THideawayNestedProps>(
    { keys: {}, path: [] },
    nestedReducer,
  );
  const stateReducer: IHideawayStatusReducer = {
    loading: createReducer<boolean>(false, loadingReducer),
    value: compose(createReducer<THideawayAny>(null, valueReducer), identity),
    error: createReducer<THideawayAny>(null, errorReducer),
    ...(hasNested && { nested }),
  };
  return combineShallow(stateReducer);
};

export const managerApiRequest = <S, DispatchExt>(
  action: IHideawayActionContent<S, DispatchExt>,
  getState: TFHideawayGetState<S>,
  dispatch: THideawayDispatch<S, DispatchExt>,
  onErrorMiddleware?: THideawayOnError<S, DispatchExt>,
  withExtraArgument?: THideawayAnyObject,
) => {
  const {
    type,
    api,
    apiPreReducer,
    nested,
    complement,
    onError: onErrorAction,
  } = action;

  const request: IHideawayActionContent<S> = {
    type: `${type}_REQUEST`,
    ...(nested && { nested }),
    ...(complement && { complement }),
  };

  // Inform the starting process
  dispatch(request);

  return (api as TFHideawayApi<S, DispatchExt>)(
    dispatch,
    getState,
    withExtraArgument,
  )
    .then((response: Response) => {
      if (response.ok) {
        return response.json();
      }
      // Any status code
      throw response;
    })
    .then((body: S) => {
      const response: IHideawayActionContent<S> = {
        type: `${type}_RESPONSE`,
        payload: apiPreReducer ? apiPreReducer(body) : body,
        ...(nested && { nested }),
        ...(complement && { complement }),
      };
      dispatch(response);
    })
    .catch(async (reason: THideawayReason) => {
      const actionContent: IHideawayActionContent<S, DispatchExt> = {
        type: `${type}_ERROR`,
        payload: (reason as unknown) as S,
        ...(nested && { nested }),
      };
      let result: THideawayAny;
      if (onErrorMiddleware) {
        result = await onErrorMiddleware(
          actionContent,
          getState,
          dispatch,
          onErrorAction,
          withExtraArgument,
        );
      } else if (onErrorAction) {
        result = await onErrorAction(
          actionContent,
          getState,
          dispatch,
          undefined,
          withExtraArgument,
        );
      }
      if (result) {
        actionContent.payload = result;
      }
      dispatch(actionContent);
    });
};
