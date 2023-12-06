import { state } from '@web-client/presenter/app.cerebral';

/**
 * calls interactor to seal a docket entry
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const submitSealDocketEntryAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { docketEntryId, docketEntrySealedTo } = get(state.modal);
  const { docketEntries, docketNumber } = get(state.caseDetail);

  const updatedDocketEntry = await applicationContext
    .getUseCases()
    .sealDocketEntryInteractor(applicationContext, {
      docketEntryId,
      docketEntrySealedTo,
      docketNumber,
    });

  const indexToUpdate = docketEntries.findIndex(
    entry => entry.docketEntryId === docketEntryId,
  );
  docketEntries[indexToUpdate] = updatedDocketEntry;

  store.set(state.caseDetail.docketEntries, docketEntries);
};
