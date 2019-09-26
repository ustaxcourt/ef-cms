/**
 * generateTrialCalendarPdfInteractor (proxy)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.contentHtml the html content for the pdf
 * @returns {Promise<*>} the promise of the api call
 */
exports.generateTrialCalendarPdfInteractor = ({
  applicationContext,
  trialSessionId,
}) => {
  return applicationContext
    .getHttpClient()
    .post(
      `${applicationContext.getBaseUrl()}/api/trial-calendar-pdf`,
      {
        trialSessionId,
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
