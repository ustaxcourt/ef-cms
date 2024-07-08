import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generatePrintableFilingReceiptInteractor } from '@web-api/business/useCases/docketEntry/generatePrintableFilingReceiptInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for generating a printable filing receipt PDF
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generatePrintableFilingReceiptLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await generatePrintableFilingReceiptInteractor(
        applicationContext,
        JSON.parse(event.body),
        authorizedUser,
      );
    },
    authorizedUser,
  );
