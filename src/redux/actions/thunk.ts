import { fetchObjectAPI } from 'apis';
import { ThunkActions } from 'constants/thunk';
import { Dispatch } from 'react';

export const addThunkActionPayload = (obj: object) => ({
  type: ThunkActions.ADD_THUNK_OBJECT,
  response: obj,
});

export const addThunkAction = () => (dispatch: Dispatch<object>) =>
  fetchObjectAPI().then(
    (response) =>
      response.json().then((body) => dispatch(addThunkActionPayload(body))),
    (error) => dispatch(addThunkActionPayload(error)),
  );
