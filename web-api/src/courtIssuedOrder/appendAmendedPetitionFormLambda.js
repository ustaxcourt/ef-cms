const { genericHandler } = require('../genericHandler');

/**
 * Append form to a provided PDF
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.appendAmendedPetitionFormLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return await applicationContext
        .getUseCases()
        .appendAmendedPetitionFormInteractor(
          applicationContext,
          event.pathParameters,
        );
    },
    { logResults: false },
  );
