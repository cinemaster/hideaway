import { generateAction } from 'hideaway';

export const updateBooksAction = (titleValue, authorValue) => ({
  type: 'UPDATE_BOOKS',
  nested: {
    keys: { titleValue }, // The key replace the item on the path if it matches
    path: ['titles', 'titleValue', 'authorList'],
  },
  payload: authorValue,
});

export const resetBooksAction = () => ({
  type: 'RESET_BOOKS',
  nested: {
    allObject: true, // To manipulate all the object
  },
});
