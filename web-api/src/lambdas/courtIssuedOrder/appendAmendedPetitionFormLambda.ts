import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { appendAmendedPetitionFormInteractor } from '@web-api/business/useCases/courtIssuedOrder/appendAmendedPetitionFormInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * Append form to a provided PDF
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const appendAmendedPetitionFormLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await appendAmendedPetitionFormInteractor(
        applicationContext,
        event.pathParameters,
        authorizedUser,
      );
    },
    authorizedUser,
    { logResults: false },
  );
