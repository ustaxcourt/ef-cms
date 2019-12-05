const createApplicationContext = require('../applicationContext');
const { customHandle } = require('../customHandle');

/**
 * used for generating a printable PDF of a docket record
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */

exports.handler = event =>
  customHandle(event, async () => {
    const applicationContext = createApplicationContext({});
    const { caseId, docketRecordSort } = JSON.parse(event.body);

    try {
      const result = await applicationContext
        .getUseCases()
        .generateDocketRecordPdfInteractor({
          applicationContext,
          caseId,
          docketRecordSort,
        });
      applicationContext.logger.info('Case ID', caseId);
      return result;
    } catch (e) {
      applicationContext.logger.error(e);
      throw e;
    }
  });
