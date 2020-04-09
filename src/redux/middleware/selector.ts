import { pathOr } from 'ramda';
import { IHideawaySelectorOptions, IHideawayReducerState } from './contracts';

/**
 * generate the selector to retreive the state
 * @param {S} state
 * @param {IHideawaySelectorOptions<S>} options  are additional settings
 */
export const generateSelector = <S>(
  state: S,
  options: IHideawaySelectorOptions<S> = {},
) => {
  const { path = [], defaultValue } = options;
  return pathOr(defaultValue, path, state);
};

export const generateValueSelector = <S>(
  state: S,
  options: IHideawaySelectorOptions<S> = {},
) => {
  return generateSelector(state, options) as S;
};

export const generateStateSelector = <S>(
  state: S,
  options: IHideawaySelectorOptions<S> = {},
) => {
  return generateSelector(state, options) as IHideawayReducerState<S>;
};
