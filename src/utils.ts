import {
  IHideawayActionReducer,
  THideawayAction,
  THideawayAny,
  IHideawayActionContent,
  TFHideawayCombineShallow,
  THideawayAnyObject,
  TFHideawayReducer,
} from './contracts';

export const createReducer = <S>(
  initialState: S,
  reducers: IHideawayActionReducer<THideawayAny>,
) => (state: S, action: THideawayAction) => {
  const currentState = state === undefined ? initialState : state;
  if (Object.prototype.hasOwnProperty.call(reducers, action.type)) {
    return reducers[action.type](currentState, action) as S;
  }
  return currentState;
};

export const compose = <S>(...reducers: TFHideawayReducer<S>[]) => (
  initialState: S,
  action: THideawayAction,
) => reducers.reduce((state, reducer) => reducer(state, action), initialState);

/**
 * Message from `combineReducers`
 * {@link https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts}
 */
export const getUndefinedStateErrorMessage = (
  key: string,
  action: IHideawayActionContent<THideawayAny>,
) => {
  const actionType = action && action.type;
  const actionDescription =
    (actionType && `action "${String(actionType)}"`) || 'an action';

  return (
    `Given ${actionDescription}, reducer "${key}" returned undefined. ` +
    `To ignore an action, you must explicitly return the previous state. ` +
    `If you want this reducer to hold no value, you can return null instead` +
    ` of undefined.`
  );
};

/**
 * Simplified version of `combineReducers`
 * {@link https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts}
 */
export const combineShallow: TFHideawayCombineShallow = (reducers) => (
  state,
  action,
) => {
  const nextState: THideawayAnyObject = {};
  Object.keys(reducers).map((key: string) => {
    const reducer = reducers[key];
    const previousStateForKey = state[key];
    const nextStateForKey = reducer(previousStateForKey, action);
    if (typeof nextStateForKey === 'undefined') {
      const errorMessage = getUndefinedStateErrorMessage(key, action);
      throw new Error(errorMessage);
    }
    nextState[key] = nextStateForKey;
    return null;
  });
  return nextState;
};
