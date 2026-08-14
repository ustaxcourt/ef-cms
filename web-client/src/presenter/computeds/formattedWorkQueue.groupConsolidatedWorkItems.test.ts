import { MOCK_WORK_ITEM } from '@shared/test/mockWorkItem';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketClerkUser } from '../../../../shared/src/test/mockUsers';
import { groupConsolidatedWorkItems } from './formattedWorkQueue';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';

describe('groupConsolidatedWorkItems', () => {
  const { DOCKET_SECTION, STATUS_TYPES } = applicationContext.getConstants();

  const SHARED_DOCKET_ENTRY_ID = 'shared-docket-entry-id-0000-000000000001';

  const baseWorkItem: RawWorkItemWithCaseAndDocketEntryInfo = {
    ...MOCK_WORK_ITEM,
    assigneeId: docketClerkUser.userId,
    assigneeName: '',
    caseStatus: STATUS_TYPES.generalDocket,
    createdAt: '2018-12-27T18:05:54.166Z',
    docketEntry: {
      attachments: true,
      createdAt: '2018-12-27T18:05:54.164Z',
      docketEntryId: SHARED_DOCKET_ENTRY_ID,
      documentType: 'Answer',
    } as RawDocketEntry,
    docketEntryId: SHARED_DOCKET_ENTRY_ID,
    docketNumber: '101-18',
    section: DOCKET_SECTION,
    sentBy: 'respondent',
    updatedAt: '2018-12-27T18:05:54.164Z',
    workItemId: 'af60fe99-37dc-435c-9bdf-24be67769344',
  };

  /**
   * Builds a work item that is multi docketed across a consolidated group, which
   * is the shape groupConsolidatedWorkItems collapses into a single row.
   */
  const consolidatedWorkItem = ({
    docketEntryId = SHARED_DOCKET_ENTRY_ID,
    docketNumber,
    leadDocketNumber,
    multiDocketedOn = ['101-18', '202-18'],
    workItemId,
  }: {
    docketEntryId?: string;
    docketNumber: string;
    leadDocketNumber?: string;
    multiDocketedOn?: string[];
    workItemId: string;
  }): RawWorkItemWithCaseAndDocketEntryInfo => ({
    ...baseWorkItem,
    docketEntry: {
      ...baseWorkItem.docketEntry,
      multiDocketedOn,
    },
    docketEntryId,
    docketNumber,
    leadDocketNumber,
    workItemId,
  });

  it('should return work items with unique docketEntryIds untouched', () => {
    const workItemA = consolidatedWorkItem({
      docketEntryId: 'docket-entry-a',
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
      workItemId: 'work-item-a',
    });
    const workItemB = consolidatedWorkItem({
      docketEntryId: 'docket-entry-b',
      docketNumber: '202-18',
      leadDocketNumber: '101-18',
      workItemId: 'work-item-b',
    });

    const result = groupConsolidatedWorkItems([workItemA, workItemB]);

    expect(result.length).toEqual(2);
    expect(result.every(item => !item.groupedMemberCases)).toBe(true);
  });

  it('should collapse work items sharing a docketEntryId into a single item with groupedMemberCases', () => {
    const leadItem = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
      workItemId: 'lead-work-item',
    });
    const memberItem = consolidatedWorkItem({
      docketNumber: '202-18',
      leadDocketNumber: '101-18',
      workItemId: 'member-work-item',
    });

    const result = groupConsolidatedWorkItems([leadItem, memberItem]);

    expect(result.length).toEqual(1);
    expect(result[0].workItemId).toEqual('lead-work-item');
    expect(result[0].groupedMemberCases).toEqual([
      {
        docketNumber: '202-18',
        inLeadCase: false,
        workItemId: 'member-work-item',
      },
    ]);
  });

  it('should keep the lowest docket number as the returned item when it is not the lead case', () => {
    const lowestNumberedItem = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: '202-18',
      workItemId: 'lowest-numbered-work-item',
    });
    const leadItem = consolidatedWorkItem({
      docketNumber: '202-18',
      leadDocketNumber: '202-18',
      workItemId: 'lead-work-item',
    });

    const result = groupConsolidatedWorkItems([leadItem, lowestNumberedItem]);

    expect(result.length).toEqual(1);
    expect(result[0].workItemId).toEqual('lowest-numbered-work-item');
    expect(result[0].groupedMemberCases).toEqual([
      {
        docketNumber: '202-18',
        inLeadCase: true,
        workItemId: 'lead-work-item',
      },
    ]);
  });

  it('should sort groupedMemberCases by docket number', () => {
    const multiDocketedOn = ['101-18', '150-18', '202-18'];
    const leadItem = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
      multiDocketedOn,
      workItemId: 'lead-work-item',
    });
    const higherMemberItem = consolidatedWorkItem({
      docketNumber: '202-18',
      leadDocketNumber: '101-18',
      multiDocketedOn,
      workItemId: 'higher-member-work-item',
    });
    const lowerMemberItem = consolidatedWorkItem({
      docketNumber: '150-18',
      leadDocketNumber: '101-18',
      multiDocketedOn,
      workItemId: 'lower-member-work-item',
    });

    const result = groupConsolidatedWorkItems([
      higherMemberItem,
      leadItem,
      lowerMemberItem,
    ]);

    expect(result.length).toEqual(1);
    expect(
      result[0].groupedMemberCases!.map(memberCase => memberCase.docketNumber),
    ).toEqual(['150-18', '202-18']);
  });

  it('should not group work items whose docket entry is multi docketed on fewer than two cases', () => {
    const workItemA = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
      multiDocketedOn: ['101-18'],
      workItemId: 'work-item-a',
    });
    const workItemB = consolidatedWorkItem({
      docketNumber: '202-18',
      leadDocketNumber: '101-18',
      multiDocketedOn: ['101-18'],
      workItemId: 'work-item-b',
    });

    const result = groupConsolidatedWorkItems([workItemA, workItemB]);

    expect(result.length).toEqual(2);
    expect(result.every(item => !item.groupedMemberCases)).toBe(true);
  });

  it('should not group work items without a leadDocketNumber', () => {
    const workItemA = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: undefined,
      workItemId: 'work-item-a',
    });
    const workItemB = consolidatedWorkItem({
      docketNumber: '202-18',
      leadDocketNumber: undefined,
      workItemId: 'work-item-b',
    });

    const result = groupConsolidatedWorkItems([workItemA, workItemB]);

    expect(result.length).toEqual(2);
    expect(result.every(item => !item.groupedMemberCases)).toBe(true);
  });

  it('should exclude every item sharing the lead docket number from groupedMemberCases', () => {
    // Two work items on one docket number within a group is not reachable from
    // real data, since a group is one docket entry spread across distinct cases.
    // This pins the current behavior: the duplicate is dropped, not listed.
    const leadItem = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
      workItemId: 'lead-work-item',
    });
    const duplicateOfLeadItem = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
      workItemId: 'duplicate-lead-work-item',
    });
    const memberItem = consolidatedWorkItem({
      docketNumber: '202-18',
      leadDocketNumber: '101-18',
      workItemId: 'member-work-item',
    });

    const result = groupConsolidatedWorkItems([
      leadItem,
      duplicateOfLeadItem,
      memberItem,
    ]);

    expect(result.length).toEqual(1);
    expect(
      result[0].groupedMemberCases!.map(memberCase => memberCase.workItemId),
    ).toEqual(['member-work-item']);
  });

  it('should return both grouped and solo work items together', () => {
    const leadItem = consolidatedWorkItem({
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
      workItemId: 'lead-work-item',
    });
    const memberItem = consolidatedWorkItem({
      docketNumber: '202-18',
      leadDocketNumber: '101-18',
      workItemId: 'member-work-item',
    });
    const soloItem = consolidatedWorkItem({
      docketEntryId: 'unrelated-docket-entry',
      docketNumber: '303-18',
      leadDocketNumber: undefined,
      workItemId: 'solo-work-item',
    });

    const result = groupConsolidatedWorkItems([leadItem, memberItem, soloItem]);

    expect(result.length).toEqual(2);
    expect(result.map(item => item.workItemId).sort()).toEqual([
      'lead-work-item',
      'solo-work-item',
    ]);
  });
});
