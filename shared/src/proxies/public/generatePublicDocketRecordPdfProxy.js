const { post } = require('../requests');

/**
 * generatePublicDocketRecordPdfInteractor (proxy)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePublicDocketRecordPdfInteractor = ({
  applicationContext,
  caseId,
}) => {
  return post({
    applicationContext,
    body: {
      caseId,
    },
    endpoint: `/public-api/cases/${caseId}/generate-docket-record`,
    headers: {
      Accept: 'application/pdf',
    },
    options: { responseType: 'blob' },
  });
};
