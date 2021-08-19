const { genericHandler } = require('../genericHandler');
const { marshallCase } = require('./marshallers/marshallCase');
const { v2ApiWrapper } = require('./v2ApiWrapper');

/**
 * used for fetching a single case and returning it in v1 api format
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getCaseLambda = (event, options = {}) =>
  genericHandler(
    event,
    ({ applicationContext }) => {
      return v2ApiWrapper(async () => {
        const caseObject = await applicationContext
          .getUseCases()
          .getCaseInteractor(applicationContext, {
            docketNumber: event.pathParameters.docketNumber,
          });

        return marshallCase(caseObject);
      });
    },
    options,
  );
