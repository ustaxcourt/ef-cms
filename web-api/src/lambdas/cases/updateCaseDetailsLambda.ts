import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateCaseDetailsInteractor } from '@shared/business/useCases/updateCaseDetailsInteractor';

/**
 * used for updating a case's petition details information (IRS notice date, case type, case procedure,
 * requested place of trial, and petition fee information)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCaseDetailsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await updateCaseDetailsInteractor(
        applicationContext,
        {
          ...event.pathParameters,
          ...JSON.parse(event.body),
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
