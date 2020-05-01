import {
  HIDEAWAY,
  IHideawayAction,
  IHideawayActionContent,
  IHideawayActionOptions,
  TFHideawayApi,
  THideawayAny,
} from './contracts';

/**
 * @param {string} type is the Action type to reducer use.
 * @param {TFHideawayApi<S>} api is a function that returns a promise. The
 * function receive (dispatch, getState, extra) from the middleware.
 * @param {IHideawayActionOptions} options are additional settings.
 */
export const generateAction = <S = THideawayAny>(
  type: string,
  api: TFHideawayApi,
  options: IHideawayActionOptions = {},
) => {
  const { keys, path, complement, predicate, onError, allObject } = options;
  const response: IHideawayActionContent<S> = {
    type,
    api,
    ...(predicate && { predicate }),
    ...(onError && { onError }),
    ...(complement && { complement }),
    ...(keys && { nested: { keys, path: path || [], allObject } }),
  };
  return { [HIDEAWAY]: response } as IHideawayAction<S>;
};
