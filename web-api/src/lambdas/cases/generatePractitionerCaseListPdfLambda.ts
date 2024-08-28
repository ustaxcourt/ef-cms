import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { generatePractitionerCaseListPdfInteractor } from '@shared/business/useCases/generatePractitionerCaseListPdfInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for generating a printable PDF of a practitioners open and closed cases
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generatePractitionerCaseListPdfLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { userId } = event.pathParameters;

      return await generatePractitionerCaseListPdfInteractor(
        applicationContext,
        {
          userId,
        },
        authorizedUser,
      );
    },
    { logResults: false },
  );
