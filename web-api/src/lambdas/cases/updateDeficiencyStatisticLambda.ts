import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateDeficiencyStatisticInteractor } from '@web-api/business/useCases/caseStatistics/updateDeficiencyStatisticInteractor';

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
  genericHandler(event, async ({ applicationContext }) => {
    return await updateDeficiencyStatisticInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
