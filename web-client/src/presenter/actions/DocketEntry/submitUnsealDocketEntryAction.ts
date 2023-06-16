import { state } from '@web-client/presenter/app.cerebral';

/**
 * calls interactor to unseal a docket entry
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitUnsealDocketEntryAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { docketEntryId } = get(state.modal);
  const { docketEntries, docketNumber } = get(state.caseDetail);

  const updatedDocketEntry = await applicationContext
    .getUseCases()
    .unsealDocketEntryInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });

  const indexToUpdate = docketEntries.findIndex(
    entry => entry.docketEntryId === docketEntryId,
  );
  docketEntries[indexToUpdate] = updatedDocketEntry;

  store.set(state.caseDetail.docketEntries, docketEntries);
};
