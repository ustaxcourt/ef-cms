import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addConsolidatedCaseInteractor } from '@web-api/business/useCases/caseConsolidation/addConsolidatedCaseInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for consolidating cases
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const addConsolidatedCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      await addConsolidatedCaseInteractor(
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
