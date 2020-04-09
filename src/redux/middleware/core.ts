import { AnyAction, Dispatch, Middleware } from 'redux';
import {
  API,
  IHideawayApiTemplateAction,
  IHideawayThunk,
  IHideawayAction,
  THideawayMiddlewareAPI,
  THideawayDispatch,
} from './contracts';

export function hideaway<S, DispatchExt>() {
  const middleaware: Middleware<
    DispatchExt,
    S,
    THideawayDispatch<S, DispatchExt>
  > = (apiMiddleware: THideawayMiddlewareAPI<S, DispatchExt>) => (
    next: Dispatch,
  ) => (action: IHideawayAction<S>) => {
    if (API in action) {
      const actionAPI = action as IHideawayAction<S>;
      const { type, api, predicate = () => true } = actionAPI[
        API
      ] as IHideawayApiTemplateAction<S>;
      const middleawareProcess: IHideawayThunk<
        typeof Promise.prototype,
        S,
        DispatchExt
      > = (dispatch, getState) => {
        // It doesn't make anything in hideaway, but will send to thunk
        if (!predicate(getState)) return Promise.resolve();

        // Inform the starting process
        dispatch({ type: `${type}_REQUEST` });

        // It doesn't need to send anything to API because they need to have all
        // the necessary values.
        return api()
          .then((response: Response) => {
            if (response.ok) {
              return response.json();
            }
            // Any status code (Throw a response to be validate in one method on catch)
            throw response;
          })
          .then((body: string) => {
            const response = {
              type: `${type}_RESPONSE`,
              payload: body,
            };
            dispatch(response);
          })
          .catch((reason: string | Response) => {
            // String: URL wrong, CORS block, network error
            // Responsponse: status code error
            const response = {
              type: `${type}_ERROR`,
              payload: reason,
            };
            dispatch(response);
          });
      };
      return apiMiddleware.dispatch(middleawareProcess);
    }

    // next requires an action, but accept thunks under the hood
    return next((action as unknown) as AnyAction);
  };
  return middleaware;
}
