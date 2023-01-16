const { post } = require('../requests');

/**
 * generateTrialSessionPaperServicePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.calendaredCasePdfDataArray the pdf data from all the calendared cases associated with the trial session
 * @returns {Promise<*>} the promise of the api call
 */
exports.generateTrialSessionPaperServicePdfInteractor = (
  applicationContext,
  { calendaredCasePdfDataArray },
) => {
  console.log('PROXY', calendaredCasePdfDataArray);
  return post({
    applicationContext,
    body: { calendaredCasePdfDataArray },
    endpoint: '/trial-sessions/paper-service-pdf',
  });
};
