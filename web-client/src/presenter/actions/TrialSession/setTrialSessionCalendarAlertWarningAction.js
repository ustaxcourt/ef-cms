/**
 * set warning message when a trial session calendar is created with paper cases
 *
 * @returns {object} the prop of the alert success message
 */
export const setTrialSessionCalendarAlertWarningAction = () => {
  return {
    alertWarning: {
      message:
        'These cases have parties receiving paper service. Print and mail all paper service documents below.',
    },
  };
};
