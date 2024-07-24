import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { fileCourtIssuedOrderInteractor } from '@web-api/business/useCases/courtIssuedOrder/fileCourtIssuedOrderInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * lambda which is used for adding a court issued order to a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const fileCourtIssuedOrderToCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await fileCourtIssuedOrderInteractor(
      applicationContext,
      JSON.parse(event.body),
      authorizedUser,
    );
  });
