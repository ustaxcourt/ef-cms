import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteDeficiencyStatisticInteractor } from '@web-api/business/useCases/caseStatistics/deleteDeficiencyStatisticInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * deletes a statistic from the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteDeficiencyStatisticLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await deleteDeficiencyStatisticInteractor(
      applicationContext,
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
