import { fetchObjectAPI } from 'apis';
import { ThunkActions } from 'constants/thunk';
import { Dispatch } from 'react';

export const addThunkSimpleAction = (obj: object) => ({
  type: ThunkActions.ADD_THUNK_OBJECT,
  response: obj,
});

export const addThunkApiAction = (text: string) => (
  dispatch: Dispatch<object>,
) =>
  fetchObjectAPI(text).then(
    (response) =>
      response.json().then((body) => dispatch(addThunkSimpleAction(body))),
    (error) => dispatch(addThunkSimpleAction(error)),
  );
