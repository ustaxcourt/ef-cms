export const getCaseWorksheetsAction = async ({
  applicationContext,
}: ActionProps) => {
  const worksheets = await applicationContext
    .getUseCases()
    .getCaseWorksheetsForJudgeInteractor(applicationContext);

  return {
    worksheets,
  };
};
