const { post } = require('../requests');

/**
 * fileCourtIssuedDocketEntryProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.document the document data
 * @returns {Promise<*>} the promise of the api call
 */
exports.fileCourtIssuedDocketEntryInteractor = ({
  applicationContext,
  document,
}) => {
  const { caseId } = document;
  return post({
    applicationContext,
    body: {
      document,
    },
    endpoint: `/case-documents/${caseId}/court-issued-docket-entry`,
  });
};
