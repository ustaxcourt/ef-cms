import { state } from '@web-client/presenter/app.cerebral';

export const getTrialSessionPlanningReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { trialTerm, trialYear } = get(state.trialSessionPlanningReportData);

  const { previousTerms, trialLocationData } = await applicationContext
    .getUseCases()
    .getTrialSessionPlanningReportDataInteractor(applicationContext, {
      term: trialTerm,
      year: trialYear,
    });

  return {
    previousTerms,
    trialLocationData,
  };
};
