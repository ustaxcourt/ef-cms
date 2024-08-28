import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createCaseInteractor } from '@web-api/business/useCases/createCaseInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for creating a new case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createCaseLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await createCaseInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
