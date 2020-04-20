import { or, pathOr } from 'ramda';
import { IHideawaySelectorOptions, THideawayAny } from './contracts';

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
    const { keys, path: nestedPath } = nested;
    const mappedList = nestedPath.map((key) => or(keys[key], key));
    return pathOr(defaultValue, mappedList, result);
  }
  return result as R;
};
