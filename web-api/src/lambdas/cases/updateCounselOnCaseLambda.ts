import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateCounselOnCaseInteractor } from '@web-api/business/useCases/caseAssociation/updateCounselOnCaseInteractor';

/**
 * used for updating a privatePractitioner or irsPractitioner on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCounselOnCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await updateCounselOnCaseInteractor(
        applicationContext,
        {
          ...event.pathParameters,
          userData: JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
