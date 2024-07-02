import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getPractitionerDocumentsInteractor } from '@web-api/business/useCases/practitioner/getPractitionerDocumentsInteractor';

/**
 * creates a practitioner document for a practitioner
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionerDocumentsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await getPractitionerDocumentsInteractor(
        applicationContext,
        {
          barNumber: event.pathParameters.barNumber,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
