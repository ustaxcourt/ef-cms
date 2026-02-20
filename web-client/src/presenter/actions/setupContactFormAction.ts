import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form from state.caseDetail
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setupContactFormAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { contactId } = props;
  const caseDetail = get(state.caseDetail);
  const contactToEdit = applicationContext
    .getUtilities()
    .getPetitionerById(caseDetail, contactId);

  store.set(state.form.docketNumber, caseDetail.docketNumber);
  store.set(state.form.contact, contactToEdit);
  store.set(state.form.partyType, caseDetail.partyType);
};
