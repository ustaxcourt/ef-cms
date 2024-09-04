import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createCourtIssuedOrderPdfFromHtmlInteractor } from '@web-api/business/useCases/courtIssuedOrder/createCourtIssuedOrderPdfFromHtmlInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * create court issued order pdf from html
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const createCourtIssuedOrderPdfFromHtmlLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await createCourtIssuedOrderPdfFromHtmlInteractor(
        applicationContext,
        {
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
