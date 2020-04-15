import { THideawayState } from 'contracts/redux';
import { ReducerManagement } from 'redux/middleware/reducer';
import { HideawayActions } from '../../../../../../constants/hideaway';

const reducerManage = new ReducerManagement<THideawayState>({
  initialState: 'Unknown',
});

export const hideawayStateMultilevelReducers = reducerManage.combine({
  [HideawayActions.ADD_HIDEAWAY_SIMPLE_MULTILEVEL_STATE]: (state, action) =>
    action.text || state,
  [HideawayActions.ADD_HIDEAWAY_THUNK_MULTILEVEL_STATE]: (state, action) =>
    action.payload || state,
});
