import { THideawayState } from 'contracts/redux';
import { TReducer } from 'redux/middleware/contracts';
import { HideawayReducerManagement } from 'redux/middleware/reducer';
import { HideawayActions } from '../../constants/hideaway';

// Hideaway Management
const reducerManage = new HideawayReducerManagement<THideawayState>({
  initialState: 'Unknown',
  isStateManager: false,
});

const addSimpleHideawayReducer: TReducer<THideawayState> = (state, action) =>
  action.text || state;

reducerManage.add(
  HideawayActions.ADD_HIDEAWAY_THUNK,
  (state, action) => action.payload || state,
);

export const hideawayReducers = reducerManage.combine({
  [HideawayActions.ADD_HIDEAWAY_SIMPLE]: addSimpleHideawayReducer,
});
