import { genericHandler } from '../genericHandler';

/**
 * updates the information related to the case worksheet
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const updateCaseWorksheetInfoLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .updateCaseWorksheetInteractor(
        applicationContext,
        JSON.parse(event.body),
      );
  });
