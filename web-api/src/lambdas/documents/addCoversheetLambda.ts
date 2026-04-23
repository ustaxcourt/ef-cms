import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { enqueueAddCoversheet } from '@web-api/business/useCaseHelper/coverSheet/enqueueAddCoversheet';
import { genericHandler } from '../../genericHandler';

/**
 * used for queueing an async coversheet generation for a docket entry;
 * actual work happens in the worker_queue lambda (ADD_COVERSHEET message type).
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addCoversheetLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { docketEntryId, docketNumber } = event.pathParameters;
      await enqueueAddCoversheet(applicationContext, {
        authorizedUser,
        docketEntryId,
        docketNumber,
      });
    },
    { logResults: false },
  );
