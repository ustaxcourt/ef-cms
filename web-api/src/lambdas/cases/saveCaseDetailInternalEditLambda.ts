import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { saveCaseDetailInternalEditInteractor } from '@shared/business/useCases/saveCaseDetailInternalEditInteractor';

/**
 * used for updating a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const saveCaseDetailInternalEditLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await saveCaseDetailInternalEditInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
        caseToUpdate: JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
