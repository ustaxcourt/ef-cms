import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { opinionAdvancedSearchInteractor } from '@shared/business/useCases/opinionAdvancedSearchInteractor';

/**
 * used for fetching opinions matching the provided search string
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const opinionAdvancedSearchLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const opinionTypes =
        event.queryStringParameters.opinionTypes?.split(',') || [];

      return await opinionAdvancedSearchInteractor(
        applicationContext,
        {
          ...event.queryStringParameters,
          opinionTypes,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
