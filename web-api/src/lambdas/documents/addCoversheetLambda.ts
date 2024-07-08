import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addCoversheetInteractor } from '@web-api/business/useCases/addCoversheetInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for adding a coversheet to a new document
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addCoversheetLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await addCoversheetInteractor(
        applicationContext,
        event.pathParameters,
        authorizedUser,
      );
    },
    authorizedUser,
    { logResults: false },
  );
