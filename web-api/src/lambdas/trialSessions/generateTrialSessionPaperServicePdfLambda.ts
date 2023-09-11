import { genericHandler } from '../../genericHandler';

/**
 * used for generating the paper service PDF for the given trial session
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const generateTrialSessionPaperServicePdfLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .generateTrialSessionPaperServicePdfInteractor(applicationContext, {
        ...JSON.parse(event.body),
      });
  });
