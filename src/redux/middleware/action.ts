import {
  API,
  IHideawayAction,
  IHideawayApiTemplateAction,
  IHideawayGenerateApiOptions,
  THideawayApiFunction,
} from './contracts';

/**
 * @param {string} type is the Action type to reducer use.
 * @param {THideawayApiFunction<S>} api is a function that it receives the state and returns a promise. The function receive (dispatch, getState, extra) from middleware
 * @param {IHideawayGenerateApiActionProps} options are additional settings
 */
export const generateApiAction = <S>(
  type: string,
  api: THideawayApiFunction,
  options: IHideawayGenerateApiOptions<S> = {},
) => {
  const { keys, actionAttributes, predicate } = options;
  const response: IHideawayApiTemplateAction<S> = {
    type,
    api,
    predicate,
    ...actionAttributes,
  };
  if (keys) {
    response.keys = keys;
  }
  return { [API]: response } as IHideawayAction<S>;
};
