import { SimpleActions } from 'constants/simple';
import { AnyAction } from 'redux';
import { TReducer } from 'redux/middleware/contracts';

const initialState = 'Unknown';

const addSimpleReducer: TReducer<string> = (
  state = initialState,
  action: AnyAction,
) => {
  switch (action.type) {
    case SimpleActions.ADD_SIMPLE:
      return action.text;
    default:
      return state;
  }
};

export const simpleReducers = addSimpleReducer;
