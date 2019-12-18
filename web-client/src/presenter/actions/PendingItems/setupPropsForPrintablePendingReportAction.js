/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the new props
 */
export const setupPropsForPrintablePendingReportAction = ({ props }) => {
  const { caseDetail, caseIdFilter } = props;
  const returnProps = {};

  if (caseIdFilter) {
    returnProps.caseIdFilter = caseDetail.caseId;
  }

  return returnProps;
};
