import { state } from '@web-client/presenter/app.cerebral';

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @returns {object} the new props
 */
export const setupPropsForPrintablePendingReportAction = ({
  get,
  props,
}: ActionProps) => {
  const { docketNumberFilter } = props;
  const returnProps: { docketNumberFilter?: string } = {};

  if (docketNumberFilter) {
    const caseDetail = get(state.caseDetail);
    returnProps.docketNumberFilter = caseDetail.docketNumber;
  }

  return returnProps;
};
