import { SimpleActions } from 'constants/redux/actions/simple';

export const addSimpleAction = (text: string) => ({
  type: SimpleActions.ADD_SIMPLE,
  text,
});
