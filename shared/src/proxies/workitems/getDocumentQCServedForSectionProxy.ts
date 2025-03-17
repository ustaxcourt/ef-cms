import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { get } from '../requests';

/**
 * getDocumentQCServedForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the document qc served box
 * @returns {Promise<*>} the promise of the api call
 */
export const getDocumentQCServedForSectionInteractor = (
  applicationContext,
  { section },
): Promise<WorkItemAbomination[]> => {
  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/served`,
  });
};
