import { AnyAction, Dispatch, Middleware } from 'redux';
import {
  HIDEAWAY,
  IHideawayAction,
  IHideawayActionContent,
  IHideawayOptions,
  IThunk,
  THideawayAction,
  THideawayDispatch,
  THideawayReason,
} from './contracts';
import { managerApiRequest } from './manager';

export const hideaway = <S, DispatchExt = {}>(
  options: IHideawayOptions<S, DispatchExt> = {},
) => {
  const middleaware: Middleware<
    DispatchExt,
    S,
    THideawayDispatch<S, DispatchExt>
  > = (apiMiddleware) => (next: Dispatch) => <R>(
    action: THideawayAction<R, DispatchExt>,
  ) => {
    if (action && HIDEAWAY in action) {
      const { withExtraArgument, onError: onErrorMiddleware } = options;
      const actionAPI = action as IHideawayAction<S, DispatchExt>;
      const {
        type,
        api,
        apiPreReducer,
        predicate = () => true,
        nested,
        complement,
        onError: onErrorAction,
        isStateManager = true,
      } = actionAPI[HIDEAWAY] as IHideawayActionContent<S, DispatchExt>;
      const middleawareProcess: IThunk<Promise<void>, S, DispatchExt> = (
        dispatch,
        getState,
      ) => {
        if (!predicate(getState, withExtraArgument || {}) || !api)
          return Promise.resolve();

        if (isStateManager) {
          return managerApiRequest<S, DispatchExt>(
            actionAPI[HIDEAWAY] as IHideawayActionContent<S, DispatchExt>,
            getState,
            dispatch,
            onErrorMiddleware,
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
            const response: IHideawayActionContent<S, DispatchExt> = {
              type,
              payload: apiPreReducer ? apiPreReducer(body) : body,
              ...(nested && { nested }),
              ...(complement && { complement }),
            };
            dispatch(response);
            return Promise.resolve();
          })
          .catch(async (errorData: THideawayReason) => {
            let reason: THideawayReason = errorData;
            if (reason.constructor.name === 'Response') {
              reason = await (errorData as Response)
                .json()
                .then((body) => body);
            }
            const actionContent: IHideawayActionContent<
              THideawayReason,
              DispatchExt
            > = {
              type,
              payload: reason,
              ...(nested && { nested }),
              ...(complement && { complement }),
            };
            if (onErrorMiddleware) {
              await onErrorMiddleware(
                actionContent,
                getState,
                dispatch,
                onErrorAction,
                withExtraArgument,
              );
            } else if (onErrorAction) {
              await onErrorAction(
                actionContent,
                getState,
                dispatch,
                undefined,
                withExtraArgument,
              );
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
