const querystring = require('querystring');
const { get } = require('../requests');

/**
 * getDocumentQCInboxForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the document qc
 * @returns {Promise<*>} the promise of the api call
 */
exports.getDocumentQCInboxForSectionInteractor = (
  applicationContext,
  { judgeUser, section },
) => {
  const queryParams =
    judgeUser && judgeUser.name
      ? querystring.stringify({ judgeUserName: judgeUser.name })
      : '';

  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/inbox?${queryParams}`,
  });
};
