import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { associateIrsPractitionerWithCaseInteractor } from '@web-api/business/useCases/manualAssociation/associateIrsPractitionerWithCaseInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * associate irsPractitioner with case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const associateIrsPractitionerWithCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await associateIrsPractitionerWithCaseInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
