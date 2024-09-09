import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteUserCaseNoteInteractor } from '@web-api/business/useCases/caseNote/deleteUserCaseNoteInteractor';
import { genericHandler } from '../../genericHandler';

/**
 * used for deleting a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteUserCaseNoteLambda = (
  event,
  authorizedUser: UnknownAuthUser,
) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await deleteUserCaseNoteInteractor(
      applicationContext,
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
