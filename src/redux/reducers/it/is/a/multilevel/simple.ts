import { THideawayState } from '../../../../../../contracts/redux';
import { ReducerManagement } from '../../../../../middleware/reducer';
import { HideawayActions } from '../../../../../../constants/hideaway';

const reducerManage = new ReducerManagement<THideawayState>({
  initialState: 'Unknown',
  isStateManager: false,
});

export const hideawaySimpleMultilevelReducers = reducerManage.combine({
  [HideawayActions.ADD_HIDEAWAY_THUNK_MULTILEVEL]: (state, action) =>
    action.payload || state,
  [HideawayActions.ADD_HIDEAWAY_SIMPLE_MULTILEVEL]: (state, action) =>
    action.text || state,
});
