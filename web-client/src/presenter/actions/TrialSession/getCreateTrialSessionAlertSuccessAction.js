/**
 * get alert message when a trial session is created
 *
 * @returns {object} the prop of the alert success message
 */
export const getCreateTrialSessionAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'You can view the new trial session below.',
      title: 'A new trial session has been added.',
    },
  };
};
