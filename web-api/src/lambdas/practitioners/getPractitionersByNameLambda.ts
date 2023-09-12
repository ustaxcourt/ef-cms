import { genericHandler } from '../../genericHandler';

/**
 * gets practitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
export const getPractitionersByNameLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { name } = event.queryStringParameters;

    return await applicationContext
      .getUseCases()
      .getPractitionersByNameInteractor(applicationContext, {
        name,
      });
  });
