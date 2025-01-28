import { casePublicSearchInteractor } from '@web-api/business/useCases/public/casePublicSearchInteractor';
import { genericHandler } from '../../genericHandler';

export const casePublicSearchLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await casePublicSearchInteractor(applicationContext, {
      ...event.queryStringParameters,
    });
  });
