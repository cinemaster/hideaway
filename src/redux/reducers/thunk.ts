import { ThunkActions } from 'constants/redux/actions/thunk';
import { AnyAction } from 'redux';

const initialState = 'Unknown';

const addThunkReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case ThunkActions.ADD_THUNK:
      return action.response || 'error';
    default:
      return state;
  }
};

export const thunkReducers = addThunkReducer;
