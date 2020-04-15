import { THideawayState } from 'contracts/redux';
import { TFHideawayReducer } from 'redux/middleware/contracts';
import { ReducerManagement } from 'redux/middleware/reducer';
import { HideawayActions } from '../../constants/hideaway';

// Hideaway Management
const reducerManage = new ReducerManagement<THideawayState>({
  initialState: 'Unknown',
  isStateManager: false,
});

const addSimpleHideawayReducer: TFHideawayReducer<THideawayState> = (
  state,
  action,
) => action.text || state;

const addThunkHideawayReducer: TFHideawayReducer<THideawayState> = (
  state,
  action,
) => action.payload || state;

export const hideawayReducers = reducerManage.combine({
  [HideawayActions.ADD_HIDEAWAY_SIMPLE]: addSimpleHideawayReducer,
  [HideawayActions.ADD_HIDEAWAY_THUNK]: addThunkHideawayReducer,
});
