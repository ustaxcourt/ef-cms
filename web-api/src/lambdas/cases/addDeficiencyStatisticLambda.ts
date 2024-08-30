import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addDeficiencyStatisticInteractor } from '@web-api/business/useCases/caseStatistics/addDeficiencyStatisticInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * adds a statistic to the case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addDeficiencyStatisticLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await addDeficiencyStatisticInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
