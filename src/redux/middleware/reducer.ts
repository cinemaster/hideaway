import _ from 'lodash';
import { always, identity, or } from 'ramda';
import {
  IHideawayActionContent,
  IHideawayActionReducer,
  IHideawayNestedProps,
  IHideawayReducerOptions,
  TFHideawayCombineShallow,
  TFHideawayReducer,
  THideawayAny,
  THideawayAnyObject,
  THideawayNestedProps,
  THideawayAction,
  IHideawayStatusReducer,
  TFGetPathDifference,
  TStateOrNull,
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

export class ReducerManagement<S> {
  displayError: boolean;

  initialState: S;

  nested: IHideawayNestedProps | undefined;

  isNested: boolean;

  isStateManager: boolean;

  reducers: IHideawayActionReducer<S>;

  constructor(props: IHideawayReducerOptions<S> = {}) {
    const {
      displayError = false,
      // initialState forces null because state doesn't allow undefined
      initialState = null,
      isNested = false,
      isStateManager = true,
      nested,
      reducers = {},
    } = props;
    this.displayError = displayError;
    this.initialState = this.createInitialState(
      initialState,
      isStateManager,
      isNested,
      nested,
    );
    this.isNested = isNested;
    this.nested = nested;
    this.isStateManager = isStateManager;
    this.reducers = {};
    Object.keys(reducers).map((key: string) => this.add(key, reducers[key]));
  }

  private createInitialState = (
    value: TStateOrNull<S>,
    isStateManager: boolean,
    isNested: boolean,
    nested?: IHideawayNestedProps,
  ) => {
    let result = value as THideawayAny;
    if (isStateManager) {
      result = {
        loading: false,
        value,
        error: null,
        ...(nested && { nested }),
      };
    }
    if (isNested) {
      if (
        nested === undefined ||
        nested.keys === undefined ||
        nested.path === undefined
      ) {
        console.trace(
          'The initialState is set as isNested, but it does not contain the ' +
            'nested attributes.',
        );
        return {};
      }
      result = this.generateNested({}, nested as IHideawayNestedProps, result);
    }
    return result;
  };

  /**
   * Message from `combineReducers`
   * {@link https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts}
   */
  private getUndefinedStateErrorMessage = (
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
  private combineShallow: TFHideawayCombineShallow = (reducers) => (
    state,
    action,
  ) => {
    const nextState: THideawayAnyObject = {};
    Object.keys(reducers).map((key: string) => {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = this.getUndefinedStateErrorMessage(key, action);
        throw new Error(errorMessage);
      }
      nextState[key] = nextStateForKey;
      return null;
    });
    return nextState;
  };

  private generateStatusReducer = (
    prefix: string,
    reducer: TFHideawayReducer,
  ) => {
    const loadingReducer: IHideawayActionReducer<boolean> = {
      [`${prefix}_REQUEST`]: always(true),
      [`${prefix}_RESPONSE`]: always(false),
      [`${prefix}_ERROR`]: always(false),
    };
    const valueReducer: IHideawayActionReducer<THideawayAny> = {
      [`${prefix}_RESPONSE`]: reducer,
    };
    const errorReducer: IHideawayActionReducer<THideawayAny> = {
      [`${prefix}_ERROR`]: (_state, { payload }) => {
        if (payload instanceof Error) {
          if (this.displayError) console.trace(payload);
          return payload.toString();
        }
        return payload;
      },
      [`${prefix}_RESPONSE`]: always(null),
    };
    const nestedReducer: IHideawayActionReducer<THideawayNestedProps> = {
      [`${prefix}_REQUEST`]: (_state, action) => action.nested,
    };
    const nested = createReducer<THideawayNestedProps>(
      { keys: {}, path: [] },
      nestedReducer,
    );

    const stateReducer: IHideawayStatusReducer = {
      loading: createReducer<boolean>(false, loadingReducer),
      value: this.compose(
        createReducer<THideawayAny>(null, valueReducer),
        identity,
      ),
      error: createReducer<THideawayAny>(null, errorReducer),
      ...(this.isNested && { nested }),
    };
    return this.combineShallow(stateReducer);
  };

  add = (name: string, reducer: TFHideawayReducer<S>) => {
    let currentReducer = reducer;
    if (this.isStateManager) {
      currentReducer = this.generateStatusReducer(name, reducer);
    }
    this.reducers[name] = currentReducer;
  };

  private removeState = (type: string) => {
    return type.replace(/_(REQUEST|RESPONSE|ERROR)$/g, '');
  };

  private getPathDifference: TFGetPathDifference = (value, path) => {
    const pathItem = _.first(path);
    if (
      pathItem === undefined ||
      typeof value !== 'object' ||
      value === null ||
      !Object.prototype.hasOwnProperty.call(value, pathItem)
    ) {
      return value;
    }
    return this.getPathDifference(value[pathItem], _.tail(path));
  };

  private generatePath = (nested: IHideawayNestedProps) => {
    const { keys, path } = nested as IHideawayNestedProps;
    return path.map((key) => or(keys[key], key)) as string[];
  };

  private generateNested = <S>(
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
    if (path.length === 0) return { root: value };
    const currentPath = this.generatePath(nested);
    _.set((currentState as unknown) as object, currentPath, value);
    return currentState;
  };

  private composeReducers = () => (
    state: S,
    action: IHideawayActionContent<S>,
  ) => {
    // State can be undefined (reducer doesn't accept)
    const currentState = state === undefined ? this.initialState : state;
    const { type, nested } = action;
    const typeWithoutState = this.removeState(type);
    const typeMatched = _.has(this.reducers, type);
    const typeWithoutStateMatched = _.has(this.reducers, typeWithoutState);
    const hasMatched = typeMatched || typeWithoutStateMatched;
    // Ignore value, because it doesn't match with the requirement
    if (this.isNested && nested === undefined) {
      console.trace('The nested attribute is missing');
      return currentState;
    }
    if (hasMatched) {
      let currentValue = _.cloneDeep(currentState);
      const reducer = typeMatched
        ? this.reducers[type]
        : this.reducers[typeWithoutState];
      if (this.isNested) {
        const currentPath = this.generatePath(nested as IHideawayNestedProps);
        currentValue = this.getPathDifference(currentValue, currentPath);
      }
      currentValue = reducer(currentValue, action);
      if (this.isNested && !_.isEqual(currentState, currentValue)) {
        return this.generateNested(
          currentState,
          nested as IHideawayNestedProps,
          currentValue,
        );
      }
      return currentValue;
    }
    return currentState;
  };

  compose = (...reducers: TFHideawayReducer<S>[]) => (
    initialState: S,
    action: THideawayAction,
  ) =>
    reducers.reduce((state, reducer) => reducer(state, action), initialState);

  combine = (reducers?: IHideawayActionReducer<S>) => {
    _.forEach(reducers, (reducer, name) => this.add(name, reducer));
    return this.composeReducers();
  };
}
