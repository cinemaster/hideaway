import { generateAction } from 'hideaway';

export const updateBooksAction = (titleValue, authorValue) =>
  generateAction('UPDATE_BOOKS', undefined, {
    keys: { titleValue }, // The key replace the item on the path if it matches
    path: ['titles', 'titleValue', 'authorList'],
    payload: authorValue,
  });

// Example without using API and generateAction
export const resetBooksAction = () => ({
  type: 'RESET_BOOKS',
  nested: {
    allObject: true, // To manipulate all the object
  },
});
