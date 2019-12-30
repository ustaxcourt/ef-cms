import { state } from 'cerebral';

/**
 * sets the state.caseDetail which is used for displaying the red alerts at the top of the page.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.caseDetail
 */
export const setupEditPetitionDetailFormAction = ({ get, store }) => {
  const caseDetail = get(state.caseDetail);
  store.set(state.form.petitionPaymentStatus, caseDetail.petitionPaymentStatus);
};
