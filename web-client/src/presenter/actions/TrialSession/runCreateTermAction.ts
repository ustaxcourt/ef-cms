import { state } from '@web-client/presenter/app.cerebral';

export const runCreateTermAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);

  const termResult = await applicationContext
    .getUseCases()
    .generateSuggestedTrialSessionCalendarInteractor(applicationContext, {
      termEndDate,
      termName,
      termStartDate,
    });

  applicationContext
    .getUtilities()
    .downloadXlsx({ encodedXlsxArray: termResult.data, fileName: termName });
};
