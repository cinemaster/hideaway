import _ from 'lodash';
import {
  IHideawayActionContent,
  IHideawayActionReducer,
  IHideawayCombineOptions,
  IHideawayNestedProps,
  IHideawayReducerOptions,
  TFHideawayReducer,
  THideawayAny,
  TStateOrNull,
} from './contracts';
import {
  generateStatusReducer,
  removeState,
  validateStateManager,
} from './manager';
import { generateNested, reducerNested } from './nested';

/**
 * Manage the reducers
 *
 * @param {boolean} displayError It display the error on console if the fetch
 * fails
 * @param {S} initialState set an initial state for the reducer. For nested that
 * doesn't set the nested, it will assing to a root key
 * @param {IHideawayNestedProps} nested Settings necessary if it sets isNested
 * @param {boolean} isNested It enables nested path
 * @param {boolean} hasNested It doens't enable the nested path but store it
 * with the state.
 * @param {boolean} isStateManager It enables the state manager for API use
 * @param {IHideawayActionReducer} reducers The object contains the action
 * name as a key and the reducer as value.
 */
export class ReducerManagement<S> {
  displayError: boolean;

  initialState: S;

  nested: IHideawayNestedProps | undefined;

  isNested: boolean;

  hasNested: boolean;

  isStateManager: boolean;

  reducers: IHideawayActionReducer<S>;

  constructor(props: IHideawayReducerOptions<S> = {}) {
    const {
      displayError = false,
      // initialState forces null because state doesn't allow undefined
      initialState = null,
      isNested = false,
      hasNested = false,
      isStateManager = false,
      nested,
      reducers = {},
    } = props;
    this.displayError = displayError;
    this.isNested = isNested;
    this.hasNested = hasNested || isNested;
    this.initialState = this.createInitialState(
      initialState,
      isStateManager,
      isNested,
      hasNested,
      nested,
    );
    this.nested = nested;
    this.isStateManager = isStateManager;
    this.reducers = {};
    _.forEach(reducers, (reducer, name) => this.add(name, reducer));
  }

  private createInitialState = (
    value: TStateOrNull<S>,
    isStateManager: boolean,
    isNested: boolean,
    hasNested: boolean,
    nested?: IHideawayNestedProps,
  ) => {
    let result = value as THideawayAny;
    if (isStateManager) {
      result = validateStateManager(value, nested);
      if (hasNested) {
        result.nested = { keys: {}, path: [], allObject: false };
      }
    }
    if (isNested) {
      if (
        nested === undefined ||
        nested.keys === undefined ||
        nested.path === undefined
      ) {
        // Nested needs to be an object (initialState is not necessary)
        return {};
      }
      result = generateNested({}, nested as IHideawayNestedProps, result);
    }
    return result;
  };

  /**
   * Add the reducer to the reducer manager
   *
   * @param {string} name It is the action name
   * @param {TFHideawayReducer} reducer The reducer
   */
  add = (name: string, reducer: TFHideawayReducer<S>) => {
    let currentReducer = reducer;
    if (this.isStateManager) {
      currentReducer = generateStatusReducer(
        name,
        reducer,
        this.hasNested,
        this.displayError,
      );
    }
    this.reducers[name] = currentReducer;
  };

  /**
   * Add the reducer without state manager check.
   *
   * @param {string} name It is the action name
   * @param {TFHideawayReducer} reducer The reducer
   */
  addWithoutStateCheck = (name: string, reducer: TFHideawayReducer<S>) => {
    this.reducers[name] = reducer;
  };

  /**
   * Compose all the reducers registered
   */
  composeReducers = () => (state: S, action: IHideawayActionContent<S>) => {
    // State can be undefined (reducer doesn't accept)
    const currentState = state === undefined ? this.initialState : state;
    const { type, nested } = action;
    const typeWithoutState = removeState(type);
    const typeMatched = _.has(this.reducers, type);
    const typeWithoutStateMatched = _.has(this.reducers, typeWithoutState);
    const hasMatched = typeMatched || typeWithoutStateMatched;
    // Ignore value, because it doesn't match with the requirement
    if (hasMatched) {
      if (this.isNested && nested === undefined) {
        console.warn('The nested attributes are missing');
        return currentState;
      }
      const reducer = typeMatched
        ? this.reducers[type]
        : this.reducers[typeWithoutState];
      if (
        nested &&
        nested.allObject &&
        ((this.isStateManager && type.endsWith('_RESPONSE')) ||
          !this.isStateManager)
      ) {
        return reducer(currentState, action);
      }
      if (this.isNested && action.nested) {
        return reducerNested(currentState, action, reducer);
      }
      return reducer(currentState, action);
    }
    return currentState;
  };

  /**
   * Combine the reducers only.
   * By default it will NOT check if status manager is true.
   * @param {IHideawayActionReducer} reducers The object contains the action
   * name as a key and the reducer as value.
   * @param {IHideawayCombineOptions} options
   */
  combineOnly = (
    reducers: IHideawayActionReducer<S>,
    options: IHideawayCombineOptions = { ignoreCheck: true },
  ) => {
    const { ignoreCheck } = options;
    if (ignoreCheck) {
      _.forEach(reducers, (reducer, name) =>
        this.addWithoutStateCheck(name, reducer),
      );
    } else {
      _.forEach(reducers, (reducer, name) => this.add(name, reducer));
    }
  };

  /**
   * Combine the reducers.
   * By default it will check if status manager is true.
   * @param {IHideawayActionReducer} reducers The object contains the action
   * name as a key and the reducer as value.
   * @param {IHideawayCombineOptions} options
   */
  combine = (
    reducers: IHideawayActionReducer<S>,
    options: IHideawayCombineOptions = { ignoreCheck: false },
  ) => {
    this.combineOnly(reducers, options);
    return this.composeReducers();
  };
}

export class ReducerStateManagement<S> extends ReducerManagement<S> {
  constructor(props: IHideawayReducerOptions<S> = {}) {
    super({ isStateManager: true, ...props });
  }
}
