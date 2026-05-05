import { getDocumentQCServedForSectionInteractor } from '@web-client/proxies/workitems/getDocumentQCServedForSectionProxy';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCServedForSectionAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  workItems: RawWorkItemWithCaseAndDocketEntryInfo[];
}> => {
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
