export const runTrialSessionPlanningReportAction = async ({
  applicationContext,
  props,
}: ActionProps<{ term: string; year: string }>) => {
  const { term, year } = props;

  const { url } = await applicationContext
    .getUseCases()
    .runTrialSessionPlanningReportInteractor(applicationContext, {
      term,
      year,
    });

  applicationContext.getUtilities().openUrlInNewTab({ url });
};
