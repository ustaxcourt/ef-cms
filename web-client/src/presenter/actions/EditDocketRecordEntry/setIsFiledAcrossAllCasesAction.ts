import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches and sets whether the docket entry is filed across all consolidated cases
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {Promise<void>}
 */
export const setIsFiledAcrossAllCasesAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);
  const docketRecordIndex = get(state.docketRecordIndex);

  const documentDetail = docketEntries.find(
    ({ index }) => index === docketRecordIndex,
  );

  if (!documentDetail || !documentDetail.docketEntryId) {
    store.set(state.isFiledAcrossAllCases, false);
    return;
  }

  try {
    const isFiledAcrossAllCases = await applicationContext
      .getUseCases()
      .getIsFiledAcrossAllCasesInteractor(applicationContext, {
        docketEntryId: documentDetail.docketEntryId,
      });

    store.set(state.isFiledAcrossAllCases, isFiledAcrossAllCases);
  } catch (error) {
    store.set(state.isFiledAcrossAllCases, false);
  }
};
