import { genericHandler } from '../../genericHandler';

/**
 * used for deleting a judge's case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const deleteUserCaseNoteLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .deleteUserCaseNoteInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
