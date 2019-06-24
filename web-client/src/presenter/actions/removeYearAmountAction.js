import { state } from 'cerebral';

/**
 * removed the selected year amount index from the caseDetail.yearAmounts
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.props the cerebral props object used for knowing which year amount index to remove
 * @param {object} providers.store the cerebral store object needed for setting the state.caseDetails.yearAmounts
 */
export const removeYearAmountAction = ({ get, props, store }) => {
  const caseDetail = get(state.caseDetail);
  const { index } = props;
  store.set(
    state.caseDetail.yearAmounts,
    caseDetail.yearAmounts.filter((value, idx) => idx !== index),
  );
};
