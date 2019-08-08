/**
 * createDocketRecordPdfInteractor (proxy)
 *
 * @param applicationContext
 * @param docketNumber
 * @param docketRecordHtml
 * @returns {Promise<*>}
 */
exports.createDocketRecordPdfInteractor = ({
  applicationContext,
  docketNumber,
  docketRecordHtml,
}) => {
  return applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/api/docket-record-pdf`,
      {
        docketNumber,
        docketRecordHtml,
      },
      {
        headers: {
          Accept: 'application/pdf',
          Authorization: `Bearer ${applicationContext.getCurrentUserToken()}`,
        },
        responseType: 'blob',
      },
    )
    .then(response => new Blob([response.data], { type: 'application/pdf' }));
};
