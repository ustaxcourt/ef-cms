import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateCourtIssuedOrderInteractor } from '@web-api/business/useCases/courtIssuedOrder/updateCourtIssuedOrderInteractor';

/**
 * lambda which is used for updating a draft order
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCourtIssuedOrderToCaseLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
        docketEntryIdToEdit: event.pathParameters.docketEntryId,
      },
      authorizedUser,
    );
  });
