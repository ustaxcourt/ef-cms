import { state } from '@web-client/presenter/app.cerebral';

export const runCreateTermAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { termEndDate, termName, termStartDate } = get(state.modal);

  const { url } = await applicationContext
    .getUseCases()
    .generateSuggestedTrialSessionCalendarInteractor(applicationContext, {
      termEndDate,
      termName,
      termStartDate,
    });

  return { pdfUrl: url };
};
