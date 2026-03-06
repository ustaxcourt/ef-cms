import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Computed helper for consolidated outbox items
 */
export const outboxHelper = (
  get: Get,
): {
  consolidatedWorkItems: ConsolidatedWorkItem[];
  outboxRenderedRowCount: number;
  sortMemberCases: typeof sortMemberCases;
} => {
  const formattedWorkQueue = get(state.formattedWorkQueue) || [];

  let consolidatedWorkItems: ConsolidatedWorkItem[] = [];
  let outboxRenderedRowCount = 0;

  try {
    consolidatedWorkItems = consolidateWorkQueueItems(formattedWorkQueue);
    outboxRenderedRowCount = consolidatedWorkItems.length;
  } catch (e) {
    consolidatedWorkItems = [];
    outboxRenderedRowCount = 0;
  }

  return {
    consolidatedWorkItems,
    outboxRenderedRowCount,
    sortMemberCases,
  };
};

/**
 * Shape of a consolidated work item
 */
export interface ConsolidatedWorkItem {
  key: string;
  leadItemForIcons: any;
  memberCasesUnique: any[];
  representative: any;
  docGroup: { key: string; items: any[] };
  groupLead: string;
}

/**
 * Consolidates work queue items by grouping them by lead docket number,
 * then by document title, and deduplicates member cases.
 */
export function consolidateWorkQueueItems(
  formattedWorkQueue: any[],
): ConsolidatedWorkItem[] {
  return formattedWorkQueue
    .reduce((acc: any[], item: any) => {
      const lead = item.leadDocketNumber || item.docketNumber;
      const existing = acc.find(group => group.lead === lead);
      if (existing) {
        existing.items.push(item);
      } else {
        acc.push({ lead, items: [item] });
      }
      return acc;
    }, [])
    .flatMap(group => {
      const docGroups: Record<string, { key: string; items: any[] }> = {};

      // Group items by document title
      group.items.forEach((it: any) => {
        const docTitle =
          (it.docketEntry && it.docketEntry.descriptionDisplay) ||
          (it.docketEntry && it.docketEntry.documentType) ||
          'Document';
        const key = docTitle;
        if (!docGroups[key]) {
          docGroups[key] = { key, items: [it] };
        } else {
          docGroups[key].items.push(it);
        }
      });

      // Process each document group
      return Object.values(docGroups).map(docGroup => {
        const representative = docGroup.items[0];
        const leaderWithGroupedInDoc = docGroup.items.find(
          (it: any) => it.groupedCases && it.groupedCases.length > 0,
        );
        const leaderWithGroupedInGroup = group.items.find(
          (it: any) => it.groupedCases && it.groupedCases.length > 0,
        );

        const leadItemForIcons =
          leaderWithGroupedInDoc ||
          leaderWithGroupedInGroup ||
          docGroup.items.find((it: any) => it.docketNumber === group.lead) ||
          docGroup.items[0];

        const memberCasesForDoc =
          leadItemForIcons && leadItemForIcons.groupedCases
            ? [
                {
                  docketNumber: leadItemForIcons.docketNumber,
                  docketNumberWithSuffix:
                    leadItemForIcons.docketNumberWithSuffix,
                  inLeadCase: leadItemForIcons.inLeadCase,
                },
                ...leadItemForIcons.groupedCases.filter(
                  (c: any) => c.docketNumber !== leadItemForIcons.docketNumber,
                ),
              ]
            : docGroup.items;

        // Deduplicate member cases
        const memberCasesUnique: any[] = [];
        const seen = new Set();
        (memberCasesForDoc || []).forEach((c: any) => {
          if (!c) return;
          const k = c.docketNumberWithSuffix || c.docketNumber;
          if (!k) return;
          if (!seen.has(k)) {
            seen.add(k);
            memberCasesUnique.push(c);
          }
        });

        return {
          key: `${group.lead}-${docGroup.key}`,
          leadItemForIcons,
          memberCasesUnique,
          representative,
          docGroup,
          groupLead: group.lead,
        };
      });
    });
}

/**
 * Sorts member cases by lead case first, then by docket number
 */
export function sortMemberCases(cases: any[]): any[] {
  return cases.sort((a: any, b: any) => {
    if (a.inLeadCase && !b.inLeadCase) return -1;
    if (!a.inLeadCase && b.inLeadCase) return 1;
    const [an, ay] = (a.docketNumber || '').split('-');
    const [bn, by] = (b.docketNumber || '').split('-');
    const ani = parseInt(an, 10);
    const bni = parseInt(bn, 10);
    if (ani !== bni)
      return (
        (isNaN(ani) ? Number.MAX_SAFE_INTEGER : ani) -
        (isNaN(bni) ? Number.MAX_SAFE_INTEGER : bni)
      );
    return (ay || '').localeCompare(by || '');
  });
}

export const consolidateWorkQueueItemsOutboxHelper = outboxHelper;
