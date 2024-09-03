import { genericHandler } from '../../genericHandler';
import { logErrorInteractor } from '@web-api/business/useCases/logErrorInteractor';

export const logErrorLambda = event =>
  genericHandler(event, ({ applicationContext }) => {
    return logErrorInteractor(applicationContext, {
      parentMessageId: event.pathParameters.parentMessageId,
      ...JSON.parse(event.body),
    });
  });
