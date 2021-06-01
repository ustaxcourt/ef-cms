import { state } from 'cerebral';

/**
 * sets the state.form from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setupContactSecondaryFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  store.set(state.form.docketNumber, props.caseDetail.docketNumber);
  const contactSecondary = applicationContext
    .getUtilities()
    .getContactSecondary(props.caseDetail);
  store.set(state.form.contactSecondary, contactSecondary);
  store.set(state.form.partyType, props.caseDetail.partyType);
};
