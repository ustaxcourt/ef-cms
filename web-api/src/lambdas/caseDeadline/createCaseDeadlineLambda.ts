import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * create a case deadline
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createCaseDeadlineLambda = (
  event,
  authorizedUser: UnknownAuthUser,
): Promise<any | undefined> =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .createCaseDeadlineInteractor(
          applicationContext,
          {
            ...JSON.parse(event.body),
          },
          authorizedUser,
        );
    },
    authorizedUser,
  );
