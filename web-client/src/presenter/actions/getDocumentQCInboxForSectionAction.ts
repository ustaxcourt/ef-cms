import {
  CHIEF_JUDGE,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { getDocumentQCInboxForSectionInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForSectionProxy';
import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCInboxForSectionAction = async ({
  get,
}: ActionProps): Promise<{ workItems: WorkItemAbomination[] }> => {
  const selectedSection = get(state.workQueueToDisplay.section);

  const user = get(state.user);
  let judgeUser = get(state.judgeUser);

  if (user.role === ROLES.adc) {
    judgeUser = { userId: CHIEF_JUDGE };
  }

  const sectionToShow = selectedSection || user.section;
  const onlyTwoSections =
    sectionToShow !== PETITIONS_SECTION ? DOCKET_SECTION : PETITIONS_SECTION;

  const workItems = await getDocumentQCInboxForSectionInteractor({
    judgeUserId: judgeUser?.userId,
    section: onlyTwoSections,
  });

  return { workItems };
};
