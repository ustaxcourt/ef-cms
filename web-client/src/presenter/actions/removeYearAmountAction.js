import { state } from 'cerebral';

/**
 * removed the selected year amount index from the caseDetail.yearAmounts
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {Object} providers.props the cerebral props object used for knowing which year amount index to remove
 * @param {Object} providers.store the cerebral store object needed for setting the state.caseDetails.yearAmounts
 * @returns {undefined} doesn't return anything
 */
export const removeYearAmountAction = async ({ store, get, props }) => {
  const caseDetail = get(state.caseDetail);
  const { index } = props;
  store.set(
    state.caseDetail.yearAmounts,
    caseDetail.yearAmounts.filter((value, idx) => idx !== index),
  );
};
