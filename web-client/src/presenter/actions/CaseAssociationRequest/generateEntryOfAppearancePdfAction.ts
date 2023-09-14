import { state } from '@web-client/presenter/app.cerebral';

export const generateEntryOfAppearancePdfAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { docketNumber, petitioners, user } = get(state.caseDetail);
  const form = get(state.form);

  const pdfUrl = await applicationContext
    .getUseCases()
    .generateEntryOfAppearancePdfInteractor(applicationContext, {
      docketNumber,
      form,
      petitioners,
      user,
    });

  return { pdfUrl };
};
