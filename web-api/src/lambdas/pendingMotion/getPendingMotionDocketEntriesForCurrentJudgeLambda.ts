import { genericHandler } from '../../genericHandler';

export const getPendingMotionDocketEntriesForCurrentJudgeLambda = event =>
  genericHandler(event, ({ applicationContext }) =>
    applicationContext
      .getUseCases()
      .getPendingMotionDocketEntriesForCurrentJudgeInteractor(
        applicationContext,
        event.queryStringParameters,
      ),
  );
