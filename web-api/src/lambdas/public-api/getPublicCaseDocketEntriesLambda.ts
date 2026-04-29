import { genericHandler } from '../../genericHandler';
import { getPublicCaseDocketEntriesInteractor } from '@web-api/business/useCases/public/getPublicCaseDocketEntriesInteractor';

export const getPublicCaseDocketEntriesLambda = event =>
  genericHandler(event, () => {
    const parsedPage = parseInt(event.queryStringParameters?.page ?? '0', 10);

    return getPublicCaseDocketEntriesInteractor({
      docketNumber: event.pathParameters.docketNumber,
      page: Number.isNaN(parsedPage) ? 0 : parsedPage,
    });
  });
