import { fetchObjectAPI } from 'apis';
import { HideawayActions } from 'constants/hideaway';
import { generateApiAction } from 'redux/middleware/action';

export const addHideawaySimpleMultilevelAction = (text: string) => ({
  type: HideawayActions.ADD_HIDEAWAY_SIMPLE_MULTILEVEL,
  text,
});

export const addHideawayThunkMultilevelAction = (text: string) =>
  generateApiAction(HideawayActions.ADD_HIDEAWAY_THUNK_MULTILEVEL, () =>
    fetchObjectAPI(text),
  );

export const addHideawaySimpleMultilevelStateAction = (text: string) => ({
  type: `${HideawayActions.ADD_HIDEAWAY_SIMPLE_MULTILEVEL_STATE}_RESPONSE`,
  text,
});

export const addHideawayThunkMultilevelStateAction = (text: string) =>
  generateApiAction(HideawayActions.ADD_HIDEAWAY_THUNK_MULTILEVEL_STATE, () =>
    fetchObjectAPI(text),
  );

export const addHideawayThunkMultilevelStateErrorAction = (text: string) =>
  generateApiAction(HideawayActions.ADD_HIDEAWAY_THUNK_MULTILEVEL_STATE, () =>
    fetchObjectAPI(text, { error: true }),
  );
