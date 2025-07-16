import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getCaseInteractor } from '@shared/business/useCases/getCaseInteractor';

/**
 * used for fetching a single case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getCaseLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, ({ applicationContext }) =>
    getCaseInteractor(
      applicationContext,
      {
        docketNumber: event.pathParameters.docketNumber,
      },
      authorizedUser,
    ),
  );
