import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { get } from '../requests';

export const getDocumentQCServedForUserInteractor = (
  applicationContext,
  { userId }: { userId: string },
): Promise<WorkItemAbomination[]> => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/document-qc/served`,
  });
};
