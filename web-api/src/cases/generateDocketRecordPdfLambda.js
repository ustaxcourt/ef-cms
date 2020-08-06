const { genericHandler } = require('../genericHandler');

/**
 * used for generating a printable PDF of a docket record
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generateDocketRecordPdfLambda = event =>
  genericHandler(
    event,
    async ({ applicationContext }) => {
      const { docketNumber, docketRecordSort } = JSON.parse(event.body);

      return await applicationContext
        .getUseCases()
        .generateDocketRecordPdfInteractor({
          applicationContext,
          docketNumber,
          docketRecordSort,
          includePartyDetail: true,
        });
    },
    { logResults: false },
  );
