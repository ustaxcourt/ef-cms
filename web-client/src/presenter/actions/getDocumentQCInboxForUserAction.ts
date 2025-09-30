import { getCaseInteractor } from '@shared/proxies/getCaseProxy';
import { getDocumentQCInboxForUserInteractor } from '@shared/proxies/workitems/getDocumentQCInboxForUserProxy';
import { state } from '@web-client/presenter/app.cerebral';
import uniqBy from 'lodash/uniqBy';

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
    new Set(
      workItemsNeedingGroups.map(wi => wi.leadDocketNumber!) as string[],
    ),
  );

  if (leadDocketNumbers.length > 0) {
    const groupDetails = await Promise.all(
      leadDocketNumbers.map(async leadDocketNumber => {
        try {
          const caseDetail = await getCaseInteractor(applicationContext, {
            docketNumber: leadDocketNumber,
          });
          const consolidated = [
            {
              docketNumber: caseDetail.docketNumber,
              docketNumberWithSuffix: caseDetail.docketNumberWithSuffix,
            },
            ...((caseDetail.consolidatedCases as any[]) || []).map(c => ({
              docketNumber: c.docketNumber,
              docketNumberWithSuffix: c.docketNumberWithSuffix,
            })),
          ];
          const unique = uniqBy(consolidated, c => c.docketNumber);
          const groupedCases = unique.map(c => ({
            docketNumber: c.docketNumber,
            docketNumberWithSuffix: c.docketNumberWithSuffix,
            inLeadCase: c.docketNumber === leadDocketNumber,
          }));
          return { leadDocketNumber, groupedCases } as const;
        } catch (_e) {
          return { leadDocketNumber, groupedCases: undefined } as const;
        }
      }),
    );

    const byLead = new Map<
      string,
      {
        docketNumber: string;
        docketNumberWithSuffix?: string;
        inLeadCase: boolean;
      }[]
    >();
    for (const g of groupDetails) {
      if (g.groupedCases) byLead.set(g.leadDocketNumber, g.groupedCases);
    }

    const workItemsWithGroups = workItems.map(wi => {
      const needsGroups = workItemsNeedingGroups.some(
        needsGroup => needsGroup.workItemId === wi.workItemId,
      );

      return {
        ...wi,
        groupedCases:
          needsGroups && wi.leadDocketNumber && byLead.has(wi.leadDocketNumber)
            ? byLead.get(wi.leadDocketNumber)
            : undefined,
      };
    });

    return { workItems: workItemsWithGroups };
  }

  return { workItems };
};
