import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * updates a statistic on the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateDeficiencyStatisticLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .updateDeficiencyStatisticInteractor(
          applicationContext,
          {
            ...event.pathParameters,
            ...JSON.parse(event.body),
          },
          authorizedUser,
        );
    },
    authorizedUser,
  );
