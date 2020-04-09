import { TReducer } from 'redux/middleware/contracts';
import { HideawayReducerManagement } from 'redux/middleware/reducer';
import { HideawayActions } from '../../constants/hideaway';

type TSimpleHideaway = string;

// Hideaway Management
const reducerManage = new HideawayReducerManagement<TSimpleHideaway>({
  initialState: 'Unknown',
});

const addSimpleHideawayStateReducer: TReducer<TSimpleHideaway> = (
  state,
  action,
) => action.text || state;

reducerManage.add(
  HideawayActions.ADD_HIDEAWAY_STATE_STRING,
  (state, action) => action.payload || state,
);

export const hideawayStateManagementReducers = reducerManage.combine({
  [HideawayActions.ADD_SIMPLE_HIDEAWAY_STATE]: addSimpleHideawayStateReducer,
});
