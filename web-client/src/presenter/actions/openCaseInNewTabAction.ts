import { state } from 'cerebral';

/**
 * opens the given case in a new tab
 *
 * @param {object} providers the providers object
 * @param {function} providers.get the cerebral store get method
 * @param {object} providers.props the cerebral props object
 */
export const openCaseInNewTabAction = ({ get, props }) => {
  const docketNumber = props.docketNumber || get(state.caseDetail.docketNumber);

  window.open(`/case-detail/${docketNumber}`, '_blank');
};
