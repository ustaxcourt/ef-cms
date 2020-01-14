/**
 * set warning message when the case added to a trial session calendar is created with a paper case
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @returns {object} the prop of the alert success message
 */
export const addCaseToTrialSessionCalendarAlertWarningAction = ({ props }) => {
  const { docketNumber } = props.caseDetail;

  return {
    alertWarning: {
      message: `${docketNumber} has parties receiving paper service. Print and mail all paper service documents below.`,
    },
  };
};
