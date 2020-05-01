import { pathOr } from 'ramda';
import { IHideawaySelectorOptions, THideawayAny } from './contracts';
import { getNestedValue } from './nested';

/**
 * Generate the selector to retreive the state
 * @param {S} state
 * @param {IHideawaySelectorOptions} options are additional settings
 */
export const generateSelector = <S, R = THideawayAny>(
  state: S,
  options: IHideawaySelectorOptions = {},
) => {
  const { path = [], defaultValue, nested } = options;
  const result = pathOr(defaultValue, path, state);
  if (nested) {
    return getNestedValue(result, nested, defaultValue);
  }
  return result as R;
};
