import { fetchObjectAPI } from 'apis';
import { HideawayActions } from 'constants/hideaway';
import { generateAction } from 'redux/middleware/action';

export const addHideawayThunkAction = (text: string) =>
  generateAction(HideawayActions.ADD_HIDEAWAY_THUNK, () =>
    fetchObjectAPI(text),
  );

export const addHideawaySimpleAction = (text: string) => ({
  type: HideawayActions.ADD_HIDEAWAY_SIMPLE,
  text,
});
