import { getDocumentQCInboxForUserInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForUserProxy';
import { state } from '@web-client/presenter/app.cerebral';

export const getDocumentQCInboxForUserAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const user = get(state.user);
  const workItems = await getDocumentQCInboxForUserInteractor(
    applicationContext,
    {
      userId: user.userId,
    },
  );

  const workItemsNeedingGroups = workItems.filter(wi => {
    if (!wi.leadDocketNumber) return false;

    const hasLeadWorkItem = workItems.some(
      other =>
        other.docketEntryId === wi.docketEntryId &&
        other.docketNumber === wi.leadDocketNumber,
    );

    return hasLeadWorkItem;
  });

  const leadDocketNumbers = Array.from(
    new Set(workItemsNeedingGroups.map(wi => wi.leadDocketNumber!) as string[]),
  );

  if (leadDocketNumbers.length > 0) {
    const workItemsWithGroups = workItems.map(wi => {
      const needsGroups = workItemsNeedingGroups.some(
        needsGroup => needsGroup.workItemId === wi.workItemId,
      );

      const groupedCases =
        needsGroups && wi.consolidatedCases ? wi.consolidatedCases : undefined;

      return {
        ...wi,
        groupedCases,
      };
    });

    return { workItems: workItemsWithGroups };
  }

  return { workItems };
};
