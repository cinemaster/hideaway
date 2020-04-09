import { fetchStringAPI } from 'apis';
import { HideawayActions } from 'constants/hideaway';
import { generateApiAction } from 'redux/middleware/action';

export const addSimpleHideawayStateAction = (text: string) => ({
  type: `${HideawayActions.ADD_SIMPLE_HIDEAWAY_STATE}_RESPONSE`,
  text,
});

export const addHideawayStateStringAction = (text: string) =>
  generateApiAction(HideawayActions.ADD_HIDEAWAY_STATE_STRING, () =>
    fetchStringAPI(text),
  );
