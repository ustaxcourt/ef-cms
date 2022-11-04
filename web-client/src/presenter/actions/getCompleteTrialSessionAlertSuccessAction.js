/**
 * returns the success alert after completing a trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.alertSuccess
 * @param {object} providers.props the cerebral props object used for passing the props.alertSuccess
 * @returns {object} the success message
 */
export const getCompleteTrialSessionAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'Trial session updated.',
    },
  };
};
