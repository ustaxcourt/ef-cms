import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches the case metadata (without docket entries) and merges it into the existing case on state.
 */
export const refreshCaseMetadataAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);

  const updatedCase = await applicationContext
    .getUseCases()
    .getCaseInteractor(applicationContext, { docketNumber });

  const existingCase = get(state.caseDetail);

  store.set(state.caseDetail, {
    ...existingCase,
    ...updatedCase,
    docketEntries: existingCase.docketEntries,
  });
};
