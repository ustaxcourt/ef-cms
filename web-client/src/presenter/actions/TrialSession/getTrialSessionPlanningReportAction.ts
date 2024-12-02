import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionPlanningReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { term, year } = get(state.modal);

  const { previousTerms, trialLocationData } = await applicationContext
    .getUseCases()
    .getTrialSessionPlanningReportDataInteractor(applicationContext, {
      term,
      year,
    });

  return {
    previousTerms,
    trialLocationData,
  };
};
