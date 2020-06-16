/**
 * get alert message when a new paper petition is saved for later
 *
 * @returns {object} the prop of the alert success message
 */
export const getSaveCaseForLaterAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Petition saved for later service.',
    },
  };
};
