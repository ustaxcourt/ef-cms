import { state } from '@web-client/presenter/app.cerebral';

export const submitCourtIssuedDocketEntryAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);

  const documentMeta = {
    ...get(state.form),
    docketEntryId,
  };

  // The backend decides whether a coversheet is required (and enqueues it
  // when it is) from the same COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET
  // constant. Forward whatever it tells us rather than recomputing client-
  // side, so the gates can't drift out of sync.
  const result = await applicationContext
    .getUseCases()
    .fileCourtIssuedDocketEntryInteractor(applicationContext, {
      docketNumbers: [],
      documentMeta,
      subjectDocketNumber: docketNumber,
    });

  return {
    coversheetPendingForDocketEntryId:
      result?.coversheetPendingForDocketEntryId,
    docketEntryId,
  };
};
