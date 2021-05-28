import { state } from 'cerebral';

/**
 * sets the state.form from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setupContactSecondaryFormAction = ({ props, store }) => {
  //todo this will be consolidated with setupContactFormAction in the next PR to be one action for all petitioners
  store.set(state.form.docketNumber, props.caseDetail.docketNumber);
  const contactSecondary = props.caseDetail.petitioners[1];
  store.set(state.form.contactSecondary, contactSecondary);
  store.set(state.form.partyType, props.caseDetail.partyType);
};
