import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { enqueueAddCoversheet } from '@web-api/business/useCaseHelper/coverSheet/enqueueAddCoversheet';
import { genericHandler } from '../../genericHandler';

/**
 * used for queueing an async coversheet generation for a docket entry;
 * actual work happens in the worker_queue lambda (ADD_COVERSHEET message type).
 */
export const addCoversheetLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      if (!authorizedUser) {
        throw new UnauthorizedError('Unauthorized');
      }
      const { docketEntryId, docketNumber } = event.pathParameters;
      await enqueueAddCoversheet(applicationContext, {
        authorizedUser,
        docketEntryId,
        docketNumber,
      });
    },
    { logResults: false },
  );
