/**
 * get alert message when a trial session calendar is created
 *
 * @returns {object} the prop of the alert success message
 */
export const getSetTrialSessionCalendarAlertSuccessAction = () => {
  return {
    alertSuccess: {
      message: 'You can view all cases set for this trial session below.',
      title: 'Eligible cases have been set for this trial session.',
    },
  };
};
