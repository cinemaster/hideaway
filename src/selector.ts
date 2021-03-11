import { pathOr } from 'ramda';
import { TFGetState, TFGetValue } from './contracts';
import { validateStateManager } from './manager';
import { getNestedValue } from './nested';

/**
 * Retrieve the value from state
 * @param {S} state The state container
 * @param {IHideawaySelectorOptions} options are additional settings
 */
export const getValue: TFGetValue = (state, options = {}) => {
  const {
    path = [],
    defaultValue = null,
    nested,
    isStateManager = false,
  } = options;
  let result = pathOr(defaultValue, path, state);
  if (nested) {
    result = getNestedValue(result, nested, defaultValue);
  }
  if (isStateManager) {
    return validateStateManager(result, nested);
  }
  return result;
};

/**
 * Retrieve the value from state using state manager
 * @param {S} state The state container
 * @param {IHideawaySelectorOptions} options are additional settings
 */
export const getState: TFGetState = (state, options = {}) => {
  return getValue(state, { isStateManager: true, ...options });
};
