import { state } from 'cerebral';

/**
 * sets the state.form from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setupContactSecondaryFormAction = ({ props, store }) => {
  store.set(state.form.docketNumber, props.caseDetail.docketNumber);
  store.set(state.form.contactSecondary, props.caseDetail.contactSecondary);
  store.set(state.form.partyType, props.caseDetail.partyType);
};
