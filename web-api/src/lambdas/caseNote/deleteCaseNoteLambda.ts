import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteCaseNoteInteractor } from '@web-api/business/useCases/caseNote/deleteCaseNoteInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for deleting a case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteCaseNoteLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await deleteCaseNoteInteractor(
      applicationContext,
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
