const {
  generatePdfFromHtml,
} = require('../useCaseHelper/pdf/generatePdfFromHtml');

/**
 * generatePdfFromHtmlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.contentHtml the html content for the pdf
 * @param {boolean} providers.displayHeaderFooter boolean to determine if the header and footer should be displayed
 * @returns {Buffer} the pdf as a binary buffer
 */
exports.generatePdfFromHtmlInteractor = async ({
  applicationContext,
  contentHtml,
  displayHeaderFooter = true,
  docketNumber,
  headerHtml,
}) => {
  return generatePdfFromHtml({
    applicationContext,
    contentHtml,
    displayHeaderFooter,
    docketNumber,
    headerHtml,
  });
};
