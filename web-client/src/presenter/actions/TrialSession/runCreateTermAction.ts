import { state } from '@web-client/presenter/app.cerebral';

export const runCreateTermAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { termEndDate, termStartDate } = get(state.modal);

  const { url } = await applicationContext
    .getUseCases()
    .runTrialSessionPlanningReportInteractor(applicationContext, {
      term,
      year,
    });

  return { pdfUrl: url };
};
