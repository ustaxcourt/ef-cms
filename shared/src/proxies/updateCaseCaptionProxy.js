const { put } = require('./requests');

/**
 * updateCaseCaptionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.caseCaption the updated case caption
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseCaptionInteractor = ({
  applicationContext,
  caseCaption,
  caseId,
}) => {
  return put({
    applicationContext,
    body: { caseCaption },
    endpoint: `/cases/${caseId}/case-caption`,
  });
};
