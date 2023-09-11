import { genericHandler } from '../../genericHandler';

/**
 * gets irsPractitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getIrsPractitionersBySearchKeyLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { searchKey } = event.queryStringParameters;

    return await applicationContext
      .getUseCases()
      .getIrsPractitionersBySearchKeyInteractor(applicationContext, {
        searchKey,
      });
  });
