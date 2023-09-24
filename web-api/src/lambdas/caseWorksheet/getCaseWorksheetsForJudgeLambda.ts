import { genericHandler } from '../../genericHandler';

export const getCaseWorksheetsForJudgeLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return applicationContext
      .getUseCases()
      .getCaseWorksheetsForJudgeInteractor(applicationContext);
  });
