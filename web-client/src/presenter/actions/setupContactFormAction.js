import { state } from 'cerebral';

/**
 * sets the state.form from props.caseDetail
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setupContactFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  const { caseDetail, contactId } = props;
  const contactToEdit = applicationContext
    .getUtilities()
    .getPetitionerById(caseDetail, contactId);

  store.set(state.form.docketNumber, caseDetail.docketNumber);
  store.set(state.form.contact, contactToEdit);
  store.set(state.form.partyType, caseDetail.partyType);
};
