const { post } = require('./requests');

/**
 * createDocketRecordPdfInteractor
 *
 * @param applicationContext
 * @param docketNumber
 * @param pdfFile
 * @returns {Promise<*>}
 */
exports.createDocketRecordPdfInteractor = ({
  applicationContext,
  docketNumber,
  pdfFile,
}) => {
  return post({
    applicationContext,
    body: { docketNumber, pdfFile },
    endpoint: `/api/docket-record-pdf`,
  });
};
