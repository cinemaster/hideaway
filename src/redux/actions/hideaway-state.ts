import { fetchObjectAPI } from 'apis';
import { HideawayActions } from 'constants/hideaway';
import { generateApiAction } from 'redux/middleware/action';

export const addHideawaySimpleStateAction = (text: string) => ({
  type: `${HideawayActions.ADD_HIDEAWAY_SIMPLE_STATE}_RESPONSE`,
  text,
});

export const addHideawayThunkStateAction = (text: string) =>
  generateApiAction(HideawayActions.ADD_HIDEAWAY_THUNK_STATE, () =>
    fetchObjectAPI(text),
  );

export const addHideawayThunkStateErrorAction = (text: string) =>
  generateApiAction(HideawayActions.ADD_HIDEAWAY_THUNK_STATE, () =>
    fetchObjectAPI(text, { error: true }),
  );
