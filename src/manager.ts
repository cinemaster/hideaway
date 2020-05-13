import { always, identity } from 'ramda';
import {
  IHideawayActionContent,
  IHideawayActionReducer,
  IHideawayNestedProps,
  IHideawayStatusReducer,
  TFHideawayGetState,
  TFHideawayReducer,
  THideawayAny,
  THideawayAnyObject,
  THideawayDispatch,
  THideawayNestedProps,
  THideawayOnError,
  THideawayReason,
  TFHideawayApi,
} from './contracts';
import { combineShallow, compose, createReducer, isObject } from './utils';

export const removeState = (type: string) => {
  return type.replace(/_(REQUEST|RESPONSE|ERROR)$/g, '');
};

export const hasStateObject = (value: THideawayAny) => {
  if (!isObject(value)) {
    return false;
  }
  const keyList = Object.keys(value);
  return ['loading', 'value', 'error'].every((key) => keyList.includes(key));
};

export const validateStateManager = (
  value: THideawayAny,
  nested?: IHideawayNestedProps,
) => {
  if (hasStateObject(value)) {
    return value;
  }
  return {
    loading: false,
    value,
    error: null,
    ...(nested && { nested }),
  };
};

export const generateStatusReducer = (
  prefix: string,
  reducer: TFHideawayReducer,
  isNested: boolean = false,
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
    ...(isNested && { nested }),
  };
  return combineShallow(stateReducer);
};

export const managerApiRequest = <S, DispatchExt>(
  action: IHideawayActionContent<S>,
  dispatch: THideawayDispatch<S, DispatchExt>,
  getState: TFHideawayGetState<S>,
  onError?: THideawayOnError,
  withExtraArgument?: THideawayAnyObject,
) => {
  const { type, api, nested, complement } = action;

  const request: IHideawayActionContent<S> = {
    type: `${type}_REQUEST`,
    ...(nested && { nested }),
    ...(complement && { complement }),
  };

  // Inform the starting process
  dispatch(request);

  return (api as TFHideawayApi)(dispatch, getState, withExtraArgument)
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
        payload: body,
        ...(nested && { nested }),
        ...(complement && { complement }),
      };
      dispatch(response);
    })
    .catch((reason: THideawayReason) => {
      const response: IHideawayActionContent<THideawayReason> = {
        type: `${type}_ERROR`,
        payload: reason,
        ...(nested && { nested }),
      };
      const result = onError && onError(response);
      if (result) {
        response.payload = result;
      }
      dispatch(response);
    });
};
