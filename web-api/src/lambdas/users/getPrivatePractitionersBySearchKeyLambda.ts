import { genericHandler } from '../../genericHandler';

/**
 * gets practitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPrivatePractitionersBySearchKeyLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { searchKey } = event.queryStringParameters;

    return await applicationContext
      .getUseCases()
      .getPrivatePractitionersBySearchKeyInteractor(applicationContext, {
        searchKey,
      });
  });
