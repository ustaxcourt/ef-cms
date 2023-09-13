import { genericHandler } from '../../genericHandler';

export const getCaseWorksheetsForJudgeLambda = event =>
  genericHandler(event, ({ applicationContext }) => {
    return applicationContext
      .getUseCases()
      .getCaseWorksheetsForJudgeInteractor(applicationContext);
  });
