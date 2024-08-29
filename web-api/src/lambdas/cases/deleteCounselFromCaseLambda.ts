import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteCounselFromCaseInteractor } from '@web-api/business/useCases/caseAssociation/deleteCounselFromCaseInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for deleting a privatePractitioner or irsPractitioner from a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteCounselFromCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await deleteCounselFromCaseInteractor(
      applicationContext,
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
