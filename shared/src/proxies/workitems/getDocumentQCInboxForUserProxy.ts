import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { get } from '../requests';

export const getDocumentQCInboxForUserInteractor = (
  applicationContext,
  { userId },
): Promise<WorkItemWithCaseInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/inbox`,
  });
};
