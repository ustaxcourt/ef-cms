import { state } from '@web-client/presenter/app.cerebral';

export const updateContactInModalAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { docketNumber } = get(state.caseDetail);
  const { contact } = get(state.modal.form);

  const updatedCase = await applicationContext
    .getUseCases()
    .updateContactInteractor(applicationContext, {
      contactInfo: contact,
      docketNumber,
    });

  store.set(state.caseDetail, updatedCase);
};
