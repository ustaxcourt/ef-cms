const { get } = require('../requests');

/**
 * getDocumentQCServedForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the document qc served box
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentQCServedForSectionInteractor = ({
  applicationContext,
  section,
}) => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/served`,
  });
};
