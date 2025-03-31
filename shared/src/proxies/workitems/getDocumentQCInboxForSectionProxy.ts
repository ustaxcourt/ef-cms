import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { get } from '../requests';
import { applicationContext } from '@web-client/applicationContext';
import { GetDocumentQCInboxForSectionRequest } from '@web-api/business/useCases/workItems/getDocumentQCInboxForSectionInteractor';

export const getDocumentQCInboxForSectionInteractor = ({
  judgeId,
  section,
  selectedSection,
}: GetDocumentQCInboxForSectionRequest): Promise<WorkItemAbomination[]> => {
  const queryParams = { judgeId, section, selectedSection };

  return get({
    applicationContext,
    endpoint: `/sections/${section}/document-qc/inbox`,
    params: queryParams,
  });
};
