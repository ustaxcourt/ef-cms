import { state } from '@web-client/presenter/app.cerebral';

export const generateEntryOfAppearancePdfAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber, docketNumberWithSuffix, petitioners } = get(
    state.caseDetail,
  );
  const { filers } = get(state.form);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generateEntryOfAppearancePdfInteractor(applicationContext, {
      docketNumber,
      docketNumberWithSuffix,
      filers,
      petitioners,
    });

  return { pdfUrl };
};
