import { AnyAction, Dispatch, Middleware } from 'redux';
import {
  HIDEAWAY,
  IHideawayAction,
  IHideawayActionContent,
  IHideawayOptions,
  IThunk,
  IThunkDispatch,
  THideawayAction,
  THideawayDispatch,
  THideawayReason,
} from './contracts';

export const hideaway = <S, DispatchExt>(options: IHideawayOptions = {}) => {
  const middleaware: Middleware<
    IThunkDispatch<S, DispatchExt>,
    S,
    THideawayDispatch<S, DispatchExt>
  > = (apiMiddleware) => (next: Dispatch) => <R>(
    action: THideawayAction<R>,
  ) => {
    if (HIDEAWAY in action) {
      const { withExtraArgument } = options;
      const actionAPI = action as IHideawayAction<S>;
      const {
        type,
        api = () => Promise.reject(new Error('API not set')),
        predicate = () => true,
        nested,
        complement,
        onError: onErrorAction,
      } = actionAPI[HIDEAWAY] as IHideawayActionContent<S>;
      const middleawareProcess: IThunk<Promise<void>, S> = (
        dispatch,
        getState,
      ) => {
        if (!predicate(getState)) return Promise.resolve();

        const request: IHideawayActionContent<S> = {
          type: `${type}_REQUEST`,
          ...(nested && { nested }),
          ...(complement && { complement }),
        };

        // Inform the starting process
        dispatch(request);

        return api(dispatch, getState, withExtraArgument)
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
            const { onError: onErrorMiddleware } = options;
            // onErrorAction has precedence
            const onError = onErrorAction || onErrorMiddleware;
            const response: IHideawayActionContent<THideawayReason> = {
              type: `${type}_ERROR`,
              payload: reason,
              ...(nested && { nested }),
              ...(complement && { complement }),
            };
            dispatch(response);
            if (onError) {
              onError(response);
            }
          });
      };
      return apiMiddleware.dispatch(middleawareProcess);
    }

    // next requires an action
    return next((action as unknown) as AnyAction);
  };
  return middleaware;
};
