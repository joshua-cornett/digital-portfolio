// helpers/generateOptions.js

/**
 * Generate new options based on the selected option.
 *
 * @param {Object} selectedOption - The selected option's data.
 * @returns {Array<Object>} - Array of new options.
 */
export const generateOptions = (selectedOption) => {
  // Example: Return a set of child options based on the selected option
  switch (selectedOption.id) {
    case 'Option 1':
      return [{ id: 'Child 1A' }, { id: 'Child 1B' }];
    case 'Option 2':
      return [{ id: 'Child 2A' }, { id: 'Child 2B' }];
    default:
      return [];
  }
};
