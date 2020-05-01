import { always, identity } from 'ramda';
import {
  IHideawayActionReducer,
  TFHideawayReducer,
  THideawayAny,
  THideawayNestedProps,
  IHideawayStatusReducer,
} from './contracts';
import { createReducer, combineShallow, compose } from './utils';

export const removeState = (type: string) => {
  return type.replace(/_(REQUEST|RESPONSE|ERROR)$/g, '');
};

export const generateStatusReducer = (
  prefix: string,
  reducer: TFHideawayReducer,
  isNested: boolean = false,
  displayError: boolean = false,
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
        if (displayError) console.trace(payload);
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
    value: compose(createReducer<THideawayAny>(null, valueReducer), identity),
    error: createReducer<THideawayAny>(null, errorReducer),
    ...(isNested && { nested }),
  };
  return combineShallow(stateReducer);
};
