import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { sealCaseContactAddressInteractor } from '@shared/business/useCases/sealCaseContactAddressInteractor';

/**
 * used for sealing an address on a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const sealCaseContactAddressLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await sealCaseContactAddressInteractor(
        applicationContext,
        {
          ...event.pathParameters,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
