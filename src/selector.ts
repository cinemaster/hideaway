import { pathOr } from 'ramda';
import { IHideawaySelectorOptions, THideawayAny } from './contracts';
import { validateStateManager } from './manager';
import { getNestedValue } from './nested';

/**
 * Retrieve the value from state
 * @param {S} state The state container
 * @param {IHideawaySelectorOptions} options are additional settings
 */
export const getValue = <R = THideawayAny, S = THideawayAny>(
  state: S,
  options: IHideawaySelectorOptions = {},
) => {
  const {
    path = [],
    defaultValue = null,
    nested,
    isStateManager = true,
  } = options;
  let result = pathOr(defaultValue, path, state);
  if (nested) {
    result = getNestedValue(result, nested, defaultValue);
  }
  if (isStateManager) {
    const state = validateStateManager(result, nested);
    return {
      ...state,
      value: state.value || defaultValue,
    };
  }
  return result as R;
};
