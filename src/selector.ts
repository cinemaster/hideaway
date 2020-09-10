import { pathOr } from 'ramda';
import { TFGetValue } from './contracts';
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
      nested: state.nested || { keys: {}, path: [], allObject: false },
    };
  }
  return result;
};
