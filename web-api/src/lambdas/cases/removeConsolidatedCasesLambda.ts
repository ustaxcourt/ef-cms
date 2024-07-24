import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { removeConsolidatedCasesInteractor } from '@web-api/business/useCases/caseConsolidation/removeConsolidatedCasesInteractor';

/**
 * used for removing cases from consolidation
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const removeConsolidatedCasesLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    const docketNumbersToRemove = (
      event.queryStringParameters.docketNumbersToRemove || ''
    ).split(',');

    return await removeConsolidatedCasesInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        docketNumbersToRemove,
      },
      authorizedUser,
    );
  });
