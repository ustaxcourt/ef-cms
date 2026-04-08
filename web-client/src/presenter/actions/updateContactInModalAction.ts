import { state } from '@web-client/presenter/app.cerebral';

export const updateContactInModalAction = async ({
  applicationContext,
  get,
  store,
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
