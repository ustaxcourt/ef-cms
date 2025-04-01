import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { get } from '../requests';

export const getDocumentQCServedForUserInteractor = (
  applicationContext,
  { userId }: { userId: string },
): Promise<WorkItemWithCaseInfo[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
