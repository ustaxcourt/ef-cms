import { state } from '@web-client/presenter/app.cerebral';

export const submitCourtIssuedDocketEntryToConsolidatedGroupAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { docketNumbers } = props;
  const { docketNumber } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);

  const documentMeta = {
    ...get(state.form),
    docketEntryId,
  };

  await applicationContext
    .getUseCases()
    .fileCourtIssuedDocketEntryInteractor(applicationContext, {
      docketNumbers,
      documentMeta,
      subjectDocketNumber: docketNumber,
    });

  return { docketEntryId };
};
