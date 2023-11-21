import { genericHandler } from '../../genericHandler';

export const getPendingMotionCasesForCurrentJudgeLambda = event =>
  genericHandler(event, ({ applicationContext }) =>
    applicationContext
      .getUseCases()
      .getPendingMotionCasesForCurrentJudgeInteractor(
        applicationContext,
        event.queryStringParameters,
      ),
  );
