const { genericHandler } = require('../genericHandler');

/**
 * gets practitioner users by a search string (name or bar number)
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getPractitionersBySearchKeyLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const { barNumber, name } = event.queryStringParameters;

    return await applicationContext
      .getUseCases()
      .getPractitionersBySearchKeyInteractor({
        applicationContext,
        barNumber,
        name,
      });
  });
