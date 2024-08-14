import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { submitCaseAssociationRequestInteractor } from '@web-api/business/useCases/caseAssociationRequest/submitCaseAssociationRequestInteractor';

/**
 * lambda which is used for associating a user to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const privatePractitionerCaseAssociationLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await submitCaseAssociationRequestInteractor(
      applicationContext,
      {
        ...event.pathParameters,
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
