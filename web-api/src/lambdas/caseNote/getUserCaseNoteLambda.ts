import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { genericHandler } from '../../genericHandler';

/**
 * used for fetching a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getUserCaseNoteLambda = (event, authorizedUser: UnknownAuthUser) =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext.getUseCases().getUserCaseNoteInteractor(
      applicationContext,
      {
        ...event.pathParameters,
      },
      authorizedUser,
    );
  });
