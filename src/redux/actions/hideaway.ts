import { fetchStringAPI } from 'apis';
import { HideawayActions } from 'constants/hideaway';
import { generateApiAction } from 'redux/middleware/action';

export const addHideawayStringAction = (text: string) =>
  generateApiAction(HideawayActions.ADD_HIDEAWAY_STRING, () =>
    fetchStringAPI(text),
  );

export const addSimpleHideawayAction = (text: string) => ({
  type: HideawayActions.ADD_SIMPLE_HIDEAWAY,
  text,
});
