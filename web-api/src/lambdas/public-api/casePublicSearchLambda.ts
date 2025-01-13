import { casePublicSearchInteractor } from '@web-api/business/useCases/public/casePublicSearchInteractor';
import { genericHandler } from '../../genericHandler';

// Used for fetching cases matching the given name, country, state, and/or year filed range for the general public
export const casePublicSearchLambda = event =>
  genericHandler(event, async () => {
    return await casePublicSearchInteractor({
      ...event.queryStringParameters,
    });
  });
