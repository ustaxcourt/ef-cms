import { genericHandler } from '../../genericHandler';

export const getCaseWorksheetsForJudgeLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCaseWorksheetsForJudgeInteractor(applicationContext);
  });
