/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the new props
 */
export const setupPropsForPrintablePendingReportAction = ({
  props,
}: ActionProps) => {
  const { caseDetail, docketNumberFilter } = props;
  const returnProps = {};

  if (docketNumberFilter) {
    returnProps.docketNumberFilter = caseDetail.docketNumber;
  }

  return returnProps;
};
