/**
 * get alert message when a new paper petition is saved for later
 *
 * @returns {object} the prop of the alert success message
 */
export const getSaveCaseForLaterAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'The case has been created and saved for later.',
      title: 'The petition has been successfully saved for later.',
    },
  };
};
