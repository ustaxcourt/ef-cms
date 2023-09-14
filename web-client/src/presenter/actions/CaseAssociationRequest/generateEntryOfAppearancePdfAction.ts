import { state } from '@web-client/presenter/app.cerebral';

export const generateEntryOfAppearancePdfAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber, petitioners } = get(state.caseDetail);
  const { filers } = get(state.form);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generateEntryOfAppearancePdfInteractor(applicationContext, {
      docketNumber,
      filers,
      petitioners,
    });

  return { pdfUrl };
};
