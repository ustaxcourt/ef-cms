import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';
import { getUsersInSectionInteractor } from '@web-api/business/useCases/user/getUsersInSectionInteractor';

/**
 * creates a new document and attaches it to a case.  It also creates a work item on the docket section.
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUsersInSectionLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { section } = event.pathParameters || {};

      return await getUsersInSectionInteractor(
        applicationContext,
        {
          section,
        },
        authorizedUser,
      );
    },
    authorizedUser,
  );
