const { genericHandler } = require('../genericHandler');

/**
 * used for generating a printable PDF of a docket record
 *
 * @param {object} event the AWS event object
 * @returns {Promise<*|undefined>} the api gateway response object containing the statusCode, body, and headers
 */
exports.generatePdfFromHtmlLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    const {
      contentHtml,
      displayHeaderFooter,
      docketNumber,
      headerHtml,
    } = JSON.parse(event.body);

    return await applicationContext
      .getUseCases()
      .generatePdfFromHtmlInteractor({
        applicationContext,
        contentHtml,
        displayHeaderFooter,
        docketNumber,
        headerHtml,
      });
  });
