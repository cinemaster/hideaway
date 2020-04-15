import { THideawayState } from 'contracts/redux';
import { TFHideawayReducer } from 'redux/middleware/contracts';
import { ReducerManagement } from 'redux/middleware/reducer';
import { HideawayActions } from '../../constants/hideaway';

// Hideaway Management
const reducerManage = new ReducerManagement<THideawayState>({
  initialState: 'Unknown',
});

const addSimpleHideawayStateReducer: TFHideawayReducer<THideawayState> = (
  state,
  action,
) => action.text || state;

const addThunkHideawayStateReducer: TFHideawayReducer<THideawayState> = (
  state,
  action,
) => action.payload || state;

export const hideawayStateManagementReducers = reducerManage.combine({
  [HideawayActions.ADD_HIDEAWAY_SIMPLE_STATE]: addSimpleHideawayStateReducer,
  [HideawayActions.ADD_HIDEAWAY_THUNK_STATE]: addThunkHideawayStateReducer,
});
