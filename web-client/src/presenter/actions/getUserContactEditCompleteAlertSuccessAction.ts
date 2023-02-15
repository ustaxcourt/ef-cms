/**
 * Returns success message to be displayed when user contact information is
 *  finished updating
 *
 * @returns {object} the success message to display
 */
export const getUserContactEditCompleteAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Changes saved.',
    },
  };
};
