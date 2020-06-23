import {
  HIDEAWAY,
  IHideawayAction,
  IHideawayActionContent,
  IHideawayActionOptions,
  TFHideawayApi,
  THideawayAny,
} from './contracts';

/**
 * @param {string} type property that indicates the type of action being
 * performed.
 * @param {TFHideawayApi<S>} api is a function that returns a promise. The
 * function receive (dispatch, getState, extra) from the middleware.
 * @param {IHideawayActionOptions} options are additional settings.
 */
export const generateAction = <S = THideawayAny>(
  type: string,
  api: TFHideawayApi | undefined,
  options: IHideawayActionOptions<S> = {},
) => {
  const {
    apiPreReducer,
    keys,
    path,
    complement,
    predicate,
    onError,
    allObject,
    isStateManager,
    payload,
  } = options;
  const hasApi = api && typeof api === 'function';
  const action: IHideawayActionContent<S> = {
    type,
    ...(hasApi && apiPreReducer && { apiPreReducer }),
    ...(predicate && { predicate }),
    ...(onError && { onError }),
    ...(complement && { complement }),
    ...(keys && { nested: { keys, path: path || [], allObject } }),
    ...(isStateManager !== undefined && { isStateManager }),
    ...(payload && { payload }),
  };
  if (hasApi) {
    return { type, [HIDEAWAY]: { ...action, api } } as IHideawayAction<S>;
  }
  return action as IHideawayAction<S>;
};
