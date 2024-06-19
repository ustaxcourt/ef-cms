import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseDeadlinesInteractor } from '@shared/business/useCases/getCaseDeadlinesInteractor';

/**
 * get case deadlines between start and end date
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseDeadlinesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getCaseDeadlinesInteractor(
        applicationContext,
        {
          ...event.queryStringParameters,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
