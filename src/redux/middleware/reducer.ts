import _ from 'lodash';
import { always, identity } from 'ramda';
import { combineReducers } from 'redux';
import {
  IActionReducer,
  IHideawayReducerOptions,
  IHideawayAction,
  THideawayAny,
  TReducer,
  THideawayReduserState,
} from './contracts';

export const createReducer = <S>(
  initialState: S,
  actionReducers: IActionReducer<S>,
) => (state: S, action: IHideawayAction<S>) => {
  const currentState = state === undefined ? initialState : state;
  if (Object.prototype.hasOwnProperty.call(actionReducers, action.type)) {
    return actionReducers[action.type](currentState, action) as S;
  }
  return currentState;
};

export class HideawayReducerManagement<S> {
  initialState: S;

  reducers: IActionReducer<S>;

  isStateManager: boolean;

  constructor(props: IHideawayReducerOptions<S> = {}) {
    // initialState forces null because state doesn't allow undefined
    const { initialState = null, isStateManager = true } = props;
    this.isStateManager = isStateManager;
    this.initialState = this.createInitialState(initialState, isStateManager);
    this.reducers = { ...props.reducers };
  }

  createInitialState = <S>(
    value: THideawayReduserState<S> | null = null,
    isStateManager: boolean,
  ) => {
    if (isStateManager) {
      return this.generateState(value);
    }
    return value as THideawayReduserState<S>;
  };

  private generateState = <S>(value: S, actionType = '') => {
    return {
      loading: actionType.endsWith('_REQUEST'),
      value: value || null,
      error: null,
    } as THideawayReduserState<S>;
  };

  private generateStatusReducer = (prefix: string, reducer: TReducer<S>) => {
    const loadingReducer: IActionReducer<boolean> = {
      [`${prefix}_REQUEST`]: always(true),
      [`${prefix}_RESPONSE`]: always(false),
      [`${prefix}_ERROR`]: always(false),
    };
    const valueReducer: IActionReducer<THideawayReduserState<S>> = {
      [`${prefix}_RESPONSE`]: reducer,
    };
    const errorReducer: IActionReducer<THideawayAny> = {
      [`${prefix}_ERROR`]: (_state, { payload }) => payload,
      [`${prefix}_RESPONSE`]: always(null),
    };
    return (combineReducers({
      loading: createReducer<boolean>(false, loadingReducer),
      value: this.compose(
        createReducer(
          (null as unknown) as THideawayReduserState<S>,
          valueReducer,
        ),
        identity,
      ),
      error: createReducer<THideawayAny>(null, errorReducer),
    }) as unknown) as TReducer<S>;
  };

  add(name: string, reducer: TReducer<S>) {
    let currentReducer = reducer;
    if (this.isStateManager) {
      currentReducer = this.generateStatusReducer(name, currentReducer);
    }
    this.reducers[name] = currentReducer;
  }

  private removeState = (type: string) => {
    return type.replace(/_(REQUEST|RESPONSE|ERROR)$/g, '');
  };

  private composeReducers = () => (
    state: S = this.initialState,
    action: IHideawayAction<S>,
  ) => {
    const typeWithoutState = this.removeState(action.type);
    const typeMatched = _.has(this.reducers, action.type);
    const typeWithoutStateMatched = _.has(this.reducers, typeWithoutState);
    const hasMatched = typeMatched || typeWithoutStateMatched;

    if (hasMatched) {
      const reducer = typeMatched
        ? this.reducers[action.type]
        : this.reducers[typeWithoutState];
      return reducer(state, action);
    }
    return state;
  };

  compose = <S>(...reducers: TReducer<S>[]) => (
    initialState: S,
    action: IHideawayAction<S>,
  ) =>
    reducers.reduce((state, reducer) => reducer(state, action), initialState);

  combine = (reducers?: IActionReducer<S>) => {
    _.forEach(reducers, (reducer, name) => this.add(name, reducer));
    return this.composeReducers();
  };
}
