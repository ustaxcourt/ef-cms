const { genericHandler } = require('../genericHandler');
const { v2ApiWrapper } = require('./v2ApiWrapper');

/**
 * used for getting the reconciliation report for IRS Superuser that lists all
 * items served on the IRS (indicated by servedParty of R or B) on a specific
 * day (12:00am-11:59:59pm ET)
 *
 * @param {object} event the AWS event object
 * @param {object} options options to optionally pass to the genericHandler
 * @returns {Promise<*|undefined>} the api gateway response object containing the reconciliation report
 */
exports.getReconciliationReportLambda = (event, options = {}) =>
  genericHandler(
    event,
    ({ applicationContext }) => {
      return v2ApiWrapper(async () => {
        const report = await applicationContext
          .getUseCases()
          .getReconciliationReportInteractor(
            applicationContext,
            event.pathParameters,
          );

        return report;
      });
    },
    options,
  );
