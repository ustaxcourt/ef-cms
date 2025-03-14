import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { get } from '../requests';

export const getDocumentQCInboxForUserInteractor = (
  applicationContext,
  { userId },
): Promise<WorkItemAbomination[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
