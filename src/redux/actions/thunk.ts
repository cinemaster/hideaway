import { fetchThunkAPI } from 'api/thunk';
import { ThunkActions } from 'constants/redux/actions/thunk';
import { Dispatch } from 'react';

export const addThunkActionPayload = (obj: object) => ({
  type: ThunkActions.ADD_THUNK,
  response: obj,
});

export const addThunkAction = () => (dispatch: Dispatch<object>) =>
  fetchThunkAPI().then(
    (response) =>
      response.json().then((body) => dispatch(addThunkActionPayload(body))),
    (error) => dispatch(addThunkActionPayload(error)),
  );
