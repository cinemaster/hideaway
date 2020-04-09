import { SimpleActions } from 'constants/simple';

export const addSimpleAction = (text: string) => ({
  type: SimpleActions.ADD_SIMPLE,
  text,
});
