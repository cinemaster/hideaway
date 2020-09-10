import _ from 'lodash';
import { or, pathOr } from 'ramda';
import {
  IHideawayNestedProps,
  THideawayAny,
  TFGetPathDifference,
  IHideawayActionContent,
  TFHideawayReducer,
} from './contracts';

export const generatePath = (nested?: IHideawayNestedProps) => {
  const { keys = {}, path = [] } = nested || {};
  return path.map((key) => or(keys[key], key)) as string[];
};

export const getPathDifference: TFGetPathDifference = (value, path) => {
  const pathItem = _.first(path);
  if (
    pathItem === undefined ||
    typeof value !== 'object' ||
    value === null ||
    !Object.prototype.hasOwnProperty.call(value, pathItem)
  ) {
    return value;
  }
  return getPathDifference(value[pathItem], _.tail(path));
};

/**
 * Return the value from the state using the nested path from action
 * @param {S} state The state expected to be used on reducer.
 * @param {IHideawayNestedProps} nested contains the keys and the path to update
 * the object.
 * @param {THideawayAny} defaultValue It return this value in case state is
 * undefined or action doesn't have filled the nested attribute.
 */
export const getNestedValue = <R = THideawayAny, S = THideawayAny>(
  state: S,
  nested?: IHideawayNestedProps,
  defaultValue?: R,
) => {
  const mappedList = generatePath(nested);
  return pathOr(defaultValue, mappedList, state);
};

export const generateNested = <S>(
  state: S,
  nested: IHideawayNestedProps,
  value: THideawayAny,
) => {
  const { keys, path } = nested;
  const currentState = _.cloneDeep(state);
  if (keys === undefined || path === undefined) {
    const type = keys === undefined ? 'keys' : 'path';
    console.trace(`The ${type} attribute is undefined on nested definition`);
    return currentState;
  }
  if (path.length === 0) return ({ root: value } as unknown) as S;
  const currentPath = generatePath(nested);
  _.set((currentState as unknown) as object, currentPath, value);
  return currentState;
};

export const reducerNested = <S>(
  state: S,
  action: IHideawayActionContent<S>,
  reducer: TFHideawayReducer<S>,
) => {
  const { nested } = action;
  if (!nested) {
    return reducer(state, action);
  }
  const currentState = getNestedValue<THideawayAny, S>(state, nested, null);
  const result = reducer(currentState, action);
  return generateNested(state, nested, result);
};
