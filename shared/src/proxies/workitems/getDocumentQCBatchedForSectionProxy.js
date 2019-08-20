const { get } = require('../requests');

/**
 * getDocumentQCBatchedForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the document qc
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentQCBatchedForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/batched`,
  });
};
