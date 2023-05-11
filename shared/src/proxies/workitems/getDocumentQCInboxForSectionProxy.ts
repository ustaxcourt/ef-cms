import { get } from '../requests';

/**
 * getDocumentQCInboxForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the document qc
 * @returns {Promise<*>} the promise of the api call
 */
export const getDocumentQCInboxForSectionInteractor = (
  applicationContext,
  { judgeUser, section },
) => {
  const queryParams =
    judgeUser && judgeUser.name ? { judgeUserName: judgeUser.name } : {};

  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/inbox`,
    params: queryParams,
  });
};
