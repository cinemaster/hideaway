import { ThunkActions } from 'constants/thunk';
import { AnyAction } from 'redux';
import { TReducer } from 'redux/middleware/contracts';

const initialState = 'Unknown';

const addThunkReducer: TReducer<string> = (
  state = initialState,
  action: AnyAction,
) => {
  switch (action.type) {
    case ThunkActions.ADD_THUNK_OBJECT:
      return action.response || 'error';
    default:
      return state;
  }
};

export const thunkReducers = addThunkReducer;
