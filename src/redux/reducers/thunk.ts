import { ThunkActions } from 'constants/thunk';
import { AnyAction } from 'redux';
import { TFHideawayReducer } from 'redux/middleware/contracts';

const initialState = 'Unknown';

const addThunkReducer: TFHideawayReducer<string> = (
  state = initialState,
  action: AnyAction,
) => {
  switch (action.type) {
    case ThunkActions.ADD_THUNK_OBJECT:
      return action.response || state;
    default:
      return state;
  }
};

export const thunkReducers = addThunkReducer;
