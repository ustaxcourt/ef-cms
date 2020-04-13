/**
 * get alert message when a trial session is created
 *
 * @returns {object} the prop of the alert success message
 */
export const getCreateTrialSessionAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Trial session added.',
    },
  };
};
