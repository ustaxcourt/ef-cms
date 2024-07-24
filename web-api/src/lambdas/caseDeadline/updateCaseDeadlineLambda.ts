import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateCaseDeadlineInteractor } from '@web-api/business/useCases/caseDeadline/updateCaseDeadlineInteractor';

/**
 * update case deadline
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCaseDeadlineLambda = (
  event,
  authorizedUser: UnknownAuthUser,
): Promise<any | undefined> =>
  genericHandler(event, async ({ applicationContext }) => {
    return await updateCaseDeadlineInteractor(
      applicationContext,
      {
        ...JSON.parse(event.body),
      },
      authorizedUser,
    );
  });
