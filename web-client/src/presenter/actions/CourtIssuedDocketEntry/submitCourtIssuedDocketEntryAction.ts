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

  const result = await applicationContext
    .getUseCases()
    .fileCourtIssuedDocketEntryInteractor(applicationContext, {
      docketNumbers: [],
      documentMeta,
      subjectDocketNumber: docketNumber,
    });

  return {
    pendingCoversheetDocketEntryIds: result?.pendingCoversheetDocketEntryIds,
    docketEntryId,
  };
};
