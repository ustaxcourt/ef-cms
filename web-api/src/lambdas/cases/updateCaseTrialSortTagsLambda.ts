import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { updateCaseTrialSortTagsInteractor } from '@shared/business/useCases/updateCaseTrialSortTagsInteractor';

/**
 * updates case trial sort tags
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCaseTrialSortTagsLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await updateCaseTrialSortTagsInteractor(
        applicationContext,
        {
          ...event.pathParameters,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
