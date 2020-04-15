import { ReducerManagement } from 'redux/middleware/reducer';
import { HideawayActions } from '../../../../../../constants/hideaway';

type TObjectHideaway = {
  text: string;
  counter: number;
} | null;

const reducerManage = new ReducerManagement<TObjectHideaway>({
  initialState: { text: 'Unknown', counter: 0 },
  nested: {
    keys: {
      a: 'mock A',
      b: 'mock B',
      c: 'mock C',
    },
    path: ['a', 'b', 'c'],
  },
  isNested: true,
});

export const hideawayStateNestedReducers = reducerManage.combine({
  [HideawayActions.ADD_HIDEAWAY_NESTED_STATE]: (state, action) => {
    const { payload } = action;
    const count = ((state && state.counter) || 0) + 1;
    return {
      text: `${payload.key} - Count: ${count}`,
      counter: count,
    };
  },
});
