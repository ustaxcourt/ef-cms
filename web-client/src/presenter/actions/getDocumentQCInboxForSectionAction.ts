import { getDocumentQCInboxForSectionInteractor } from '@web-client/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCInboxForSectionAction = async ({
  get,
}: ActionProps): Promise<{
  workItems: RawWorkItemWithCaseAndDocketEntryInfo[];
}> => {
  const user = get(state.user);
  const judgeUser = get(state.judgeUser);
  const selectedSection = get(state.workQueueToDisplay.section);

  if (!user.section) {
    throw new Error('Unable to fetch work items without a section');
  }

  const workItems = await getDocumentQCInboxForSectionInteractor({
    judgeId: judgeUser?.userId,
    section: user.section,
    selectedSection,
  });

  return { workItems };
};
