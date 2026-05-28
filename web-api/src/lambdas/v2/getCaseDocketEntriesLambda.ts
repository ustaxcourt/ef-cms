import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseDocketEntriesInteractor } from '@web-api/business/useCases/getCaseDocketEntriesInteractor';
import { marshallDocketEntry } from './marshallers/marshallDocketEntry';
import { v2ApiWrapper } from './v2ApiWrapper';

/**
 * used for fetching a page of docket entries for a case in v2 api format.
 * Pages are zero-indexed and contain up to 1000 entries each.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseDocketEntriesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, () =>
    v2ApiWrapper(async () => {
      const parsedPage = parseInt(event.queryStringParameters?.page ?? '0', 10);

      const result = await getCaseDocketEntriesInteractor(
        {
          docketNumber: event.pathParameters.docketNumber,
          page: Number.isNaN(parsedPage) ? 0 : parsedPage,
        },
        authorizedUser,
      );

      return {
        docketEntries: result.docketEntries.map(marshallDocketEntry),
        page: result.page,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
      };
    }),
  );
