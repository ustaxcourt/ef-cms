import { state } from '@web-client/presenter/app.cerebral';

export const updateContactInModalAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { docketNumber } = get(state.caseDetail);
  const { contact } = get(state.modal.form);

  await applicationContext
    .getUseCases()
    .updateContactInteractor(applicationContext, {
      contactInfo: contact,
      docketNumber,
    });

  const updatedCase = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, { docketNumber });

  const existingCase = get(state.caseDetail);

  store.set(state.caseDetail, {
    ...updatedCase,
    docketEntries: existingCase.docketEntries,
    messages: existingCase.messages,
  });
};
