import { fetchObjectAPI } from 'apis';
import { HideawayActions } from 'constants/hideaway';
import { generateAction } from 'redux/middleware/action';

export const addHideawaySimpleStateAction = (text: string) => ({
  type: `${HideawayActions.ADD_HIDEAWAY_SIMPLE_STATE}_RESPONSE`,
  text,
});

export const addHideawayThunkStateAction = (text: string) =>
  generateAction(HideawayActions.ADD_HIDEAWAY_THUNK_STATE, () =>
    fetchObjectAPI(text),
  );

export const addHideawayThunkStateErrorAction = (text: string) =>
  generateAction(HideawayActions.ADD_HIDEAWAY_THUNK_STATE, () =>
    fetchObjectAPI(text, { error: true }),
  );
