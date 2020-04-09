import { SimpleActions } from 'constants/redux/actions/simple';
import { AnyAction } from 'redux';

const initialState = 'Unknown';

const addSimpleReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SimpleActions.ADD_SIMPLE:
      return action.text;
    default:
      return state;
  }
};

export const simpleReducers = addSimpleReducer;
