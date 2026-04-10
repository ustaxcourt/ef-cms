import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches the case metadata (without docket entries) and replaces the case on
 * state, preserving only the existing docketEntries. This avoids stale fields
 * lingering when the server omits cleared properties (e.g. sealedDate after unsealing).
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
    ...updatedCase,
    docketEntries: existingCase.docketEntries,
    messages: existingCase.messages,
  });
};
