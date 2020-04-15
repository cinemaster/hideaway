import { fetchObjectAPI } from 'apis';
import { HideawayActions } from 'constants/hideaway';
import { IApiOptions } from 'contracts/redux';
import { generateAction } from 'redux/middleware/action';

export const addHideawayNestedStateAction = (
  text: string,
  options: IApiOptions,
) =>
  generateAction(
    HideawayActions.ADD_HIDEAWAY_NESTED_STATE,
    () => fetchObjectAPI(text),
    options,
  );

export const addHideawayNestedStateErrorAction = (
  text: string,
  options: IApiOptions,
) =>
  generateAction(
    HideawayActions.ADD_HIDEAWAY_NESTED_STATE,
    () => fetchObjectAPI(text, { error: true }),
    options,
  );
