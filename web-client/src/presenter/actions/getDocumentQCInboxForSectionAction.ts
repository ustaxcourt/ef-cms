import { getDocumentQCInboxForSectionInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCInboxForSectionAction = async ({
  get,
}: ActionProps): Promise<{ workItems: WorkItemWithCaseInfo[] }> => {
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

  console.log('workItems', workItems);

  return { workItems };
};
