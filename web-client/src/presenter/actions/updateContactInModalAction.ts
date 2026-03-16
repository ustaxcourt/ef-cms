import { state } from '@web-client/presenter/app.cerebral';

/**
 * updates contact information
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {object} providers.get the cerebral store used for getting state.form
 * @returns {object} alertSuccess, docketNumber
 */
export const updateContactInModalAction = async ({
  applicationContext,
  get,
  store
}: ActionProps) => {
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;
  const { contact } = get(state.modal.form);

  await applicationContext
    .getUseCases()
    .updateContactInteractor(applicationContext, {
      contactInfo: contact,
      docketNumber,
    });

  const updatedPetitioners = caseDetail.petitioners.map(p =>
    p.contactId === contact.contactId ? { ...p, ...contact } : p,
  );

  store.set(state.caseDetail.petitioners, updatedPetitioners);
};
