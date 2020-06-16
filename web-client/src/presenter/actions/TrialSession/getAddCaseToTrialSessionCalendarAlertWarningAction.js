/**
 * set warning message when the case added to a trial session calendar is created with a paper case
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @returns {object} the prop of the alert success message
 */
export const getAddCaseToTrialSessionCalendarAlertWarningAction = ({
  props,
}) => {
  const { docketNumber, docketNumberSuffix } = props.caseDetail;

  const displayDocketNumber = `${docketNumber}${
    docketNumberSuffix ? docketNumberSuffix : ''
  }`;

  return {
    alertWarning: {
      message: `Print and mail all paper service documents for ${displayDocketNumber} now.`,
    },
  };
};
