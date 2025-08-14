export const getConsolidatedCaseDeadlineAction = async ({
  applicationContext,
  props,
}: ActionProps<{ caseDeadlineId: string }>) => {
  const { caseDeadlineId } = props;
  const consolidatedCaseDeadlines = await applicationContext
    .getUseCases()
    .getConsolidatedCaseDeadlinesInteractor(applicationContext, {
      consolidatedCaseDeadlineId: caseDeadlineId,
    });

  return {
    consolidatedCaseDeadlines,
  };
};
