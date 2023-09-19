import { genericHandler } from '../../genericHandler';

/**
 * used for saving a case note
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const saveCaseNoteLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const lambdaArguments = {
      ...event.pathParameters,
      ...JSON.parse(event.body),
    };

    return await applicationContext
      .getUseCases()
      .saveCaseNoteInteractor(applicationContext, {
        ...lambdaArguments,
      });
  });
