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
      const { userId } = applicationContext.getCurrentUser();
      const isAssociated = await applicationContext
        .getPersistenceGateway()
        .verifyCaseForUser({
          applicationContext,
          docketNumber,
          userId,
        });

      return await applicationContext
        .getUseCases()
        .generateDocketRecordPdfInteractor({
          applicationContext,
          docketNumber,
          docketRecordSort,
          includePartyDetail: isAssociated,
        });
    },
    { logResults: false },
  );
