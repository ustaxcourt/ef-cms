const { genericHandler } = require('../genericHandler');
const { v2ApiWrapper } = require('./v2ApiWrapper');

/**
 * used for getting the download policy which is needed for consumers to download files directly from S3
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.getReconciliationReportLambda = (event, options = {}) =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      return v2ApiWrapper(async () => {
        const report = await applicationContext
          .getUseCases()
          .getReconciliationReportInteractor(
            applicationContext,
            event.pathParameters,
          );

        return report; // FIXME: do we need to use a "marshall" function here for the return value?
      });
    },
    options,
  );
