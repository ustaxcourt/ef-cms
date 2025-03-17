import { getDocumentQCServedForSectionInteractor } from '@shared/proxies/workitems/getDocumentQCServedForSectionProxy';
import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCServedForSectionAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{ workItems: WorkItemAbomination[] }> => {
  const selectedSection = get(state.workQueueToDisplay.section);

  const user = get(state.user);
  const workItems = await getDocumentQCServedForSectionInteractor(
    applicationContext,
    {
      section: selectedSection || user.section,
    },
  );
  return { workItems };
};
