import { genericHandler } from '../../genericHandler';

/**
 * used for updating a case
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const saveCaseDetailInternalEditLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor(applicationContext, {
        ...event.pathParameters,
        ...JSON.parse(event.body),
        caseToUpdate: JSON.parse(event.body),
      });
  });
