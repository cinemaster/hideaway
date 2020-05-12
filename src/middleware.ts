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
import { managerApiRequest } from './manager';

export const hideaway = <S, DispatchExt>(options: IHideawayOptions = {}) => {
  const middleaware: Middleware<
    IThunkDispatch<S, DispatchExt>,
    S,
    THideawayDispatch<S, DispatchExt>
  > = (apiMiddleware) => (next: Dispatch) => <R>(
    action: THideawayAction<R>,
  ) => {
    if (action && HIDEAWAY in action) {
      const { withExtraArgument, onError: onErrorMiddleware } = options;
      const actionAPI = action as IHideawayAction<S>;
      const {
        type,
        api,
        predicate = () => true,
        nested,
        complement,
        onError: onErrorAction,
        isStateManager = true,
      } = actionAPI[HIDEAWAY] as IHideawayActionContent<S>;
      // onErrorAction has precedence
      const onError = onErrorAction || onErrorMiddleware;
      const middleawareProcess: IThunk<Promise<void>, S> = (
        dispatch,
        getState,
      ) => {
        if (!predicate(getState, withExtraArgument || {}) || !api)
          return Promise.resolve();

        if (isStateManager) {
          return managerApiRequest(
            actionAPI[HIDEAWAY] as IHideawayActionContent<S>,
            dispatch,
            getState,
            onError,
            withExtraArgument,
          );
        }
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
              type,
              payload: body,
              ...(nested && { nested }),
              ...(complement && { complement }),
            };
            dispatch(response);
            return Promise.resolve();
          })
          .catch((reason: THideawayReason) => {
            const response: IHideawayActionContent<THideawayReason> = {
              type,
              payload: reason,
              ...(nested && { nested }),
              ...(complement && { complement }),
            };
            if (onError) {
              onError(response);
            }
            return Promise.resolve();
          });
      };
      return apiMiddleware.dispatch(middleawareProcess);
    }

    // next requires an action
    return action ? next((action as unknown) as AnyAction) : undefined;
  };
  return middleaware;
};
