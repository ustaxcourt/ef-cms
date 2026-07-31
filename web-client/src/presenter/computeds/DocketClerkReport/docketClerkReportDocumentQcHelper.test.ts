import {
  DOCKET_SECTION,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketClerkReportDocumentQcHelper as docketClerkReportDocumentQcHelperComputed } from './docketClerkReportDocumentQcHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('docketClerkReportDocumentQcHelper', () => {
  const docketClerkReportDocumentQcHelper = withAppContextDecorator(
    docketClerkReportDocumentQcHelperComputed,
    applicationContext,
  );

  const CLERK_USER_ID = 'clerk-user-id-001';

  const selectedClerk = {
    name: 'Alice Jones',
    role: ROLES.docketClerk,
    section: DOCKET_SECTION,
    userId: CLERK_USER_ID,
  };

  const buildWorkItem = (overrides = {}) => ({
    assigneeId: CLERK_USER_ID,
    assigneeName: 'Alice Jones',
    caseStatus: 'Assigned - Case',
    caseTitle: 'Test Case',
    completedAt: null,
    completedByUserId: null,
    createdAt: '2024-01-15T12:00:00.000Z',
    docketEntry: {
      createdAt: '2024-01-15T12:00:00.000Z',
      docketEntryId: 'de-uuid-001',
      documentType: 'Petition',
      eventCode: 'P',
      isFileAttached: true,
      receivedAt: '2024-01-10T12:00:00.000Z',
    },
    docketNumber: '101-24',
    inProgress: false,
    isRead: true,
    leadDocketNumber: null,
    receivedAt: '2024-01-10T12:00:00.000Z',
    section: DOCKET_SECTION,
    sentBySection: DOCKET_SECTION,
    ...overrides,
  });

  const baseState = {
    docketClerkReport: {
      inboxWorkItems: [],
      selectedClerk,
      servedWorkItems: [],
    },
  };

  it('should return empty arrays when selectedClerk is null', () => {
    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        docketClerkReport: {
          inboxWorkItems: [],
          selectedClerk: null,
          servedWorkItems: [],
        },
      },
    });

    expect(result.inbox).toEqual([]);
    expect(result.inProgress).toEqual([]);
    expect(result.processed).toEqual([]);
  });

  it('should classify a standard work item (file attached, not inProgress) as inbox', () => {
    const inboxItem = buildWorkItem({
      completedAt: null,
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-inbox',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: true,
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      inProgress: false,
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [inboxItem],
        },
      },
    });

    expect(result.inbox).toHaveLength(1);
    expect(result.inProgress).toHaveLength(0);
    expect(result.processed).toHaveLength(0);
  });

  it('should classify a work item with isFileAttached === false as inProgress', () => {
    const inProgressItem = buildWorkItem({
      completedAt: null,
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-inprogress',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: false,
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      inProgress: false,
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [inProgressItem],
        },
      },
    });

    expect(result.inProgress).toHaveLength(1);
    expect(result.inbox).toHaveLength(0);
    expect(result.processed).toHaveLength(0);
  });

  it('should classify a work item with inProgress === true as inProgress', () => {
    const inProgressItem = buildWorkItem({
      completedAt: null,
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-inprogress2',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: true,
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      inProgress: true,
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [inProgressItem],
        },
      },
    });

    expect(result.inProgress).toHaveLength(1);
    expect(result.inbox).toHaveLength(0);
  });

  it('should classify a completed served work item as processed', () => {
    const processedItem = buildWorkItem({
      completedAt: '2024-01-20T10:00:00.000Z',
      completedByUserId: CLERK_USER_ID,
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-processed',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          servedWorkItems: [processedItem],
        },
      },
    });

    expect(result.processed).toHaveLength(1);
    expect(result.inbox).toHaveLength(0);
    expect(result.inProgress).toHaveLength(0);
  });

  it('should not include items assigned to a different user in inbox', () => {
    const otherUserItem = buildWorkItem({
      assigneeId: 'different-user-id',
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-other',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: true,
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [otherUserItem],
        },
      },
    });

    expect(result.inbox).toHaveLength(0);
    expect(result.inProgress).toHaveLength(0);
  });

  it('should handle multiple items across all boxes', () => {
    const inboxItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-inbox-multi',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: true,
        receivedAt: '2024-01-08T12:00:00.000Z',
      },
      receivedAt: '2024-01-08T12:00:00.000Z',
    });
    const inProgressItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-16T12:00:00.000Z',
        docketEntryId: 'de-inprogress-multi',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: false,
        receivedAt: '2024-01-09T12:00:00.000Z',
      },
      receivedAt: '2024-01-09T12:00:00.000Z',
    });
    const processedItem = buildWorkItem({
      completedAt: '2024-01-20T10:00:00.000Z',
      completedByUserId: CLERK_USER_ID,
      docketEntry: {
        createdAt: '2024-01-10T12:00:00.000Z',
        docketEntryId: 'de-processed-multi',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        receivedAt: '2024-01-05T12:00:00.000Z',
      },
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [inboxItem, inProgressItem],
          servedWorkItems: [processedItem],
        },
      },
    });

    expect(result.inbox).toHaveLength(1);
    expect(result.inProgress).toHaveLength(1);
    expect(result.processed).toHaveLength(1);
  });

  it('should sort inbox items with a high-priority (Calendared) case status ahead of items with an earlier receivedAt', () => {
    const normalItem = buildWorkItem({
      caseStatus: 'Assigned - Case',
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-normal-priority',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: true,
        receivedAt: '2024-01-08T12:00:00.000Z',
      },
      docketNumber: '100-24',
      receivedAt: '2024-01-08T12:00:00.000Z',
    });
    const highPriorityItem = buildWorkItem({
      caseStatus: 'Calendared',
      docketEntry: {
        createdAt: '2024-01-20T12:00:00.000Z',
        docketEntryId: 'de-high-priority',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: true,
        receivedAt: '2024-01-12T12:00:00.000Z',
      },
      docketNumber: '200-24',
      receivedAt: '2024-01-12T12:00:00.000Z',
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [normalItem, highPriorityItem],
        },
      },
    });

    expect(result.inbox.map(item => item.docketNumber)).toEqual([
      '200-24',
      '100-24',
    ]);
    expect(result.inbox[0].showHighPriorityIcon).toBe(true);
  });

  it('should group consolidated inbox work items sharing a docketEntryId into a single row with groupedMemberCases', () => {
    const leadItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-consolidated-inbox',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        multiDocketedOn: [
          { docketNumber: '050-24' },
          { docketNumber: '150-24' },
        ],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '050-24',
      leadDocketNumber: '050-24',
    });
    const memberItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-consolidated-inbox',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        multiDocketedOn: [
          { docketNumber: '050-24' },
          { docketNumber: '150-24' },
        ],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '150-24',
      leadDocketNumber: '050-24',
      workItemId: 'wi-member-inbox',
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [leadItem, memberItem],
        },
      },
    });

    expect(result.inbox).toHaveLength(1);
    expect(result.inbox[0].docketNumber).toBe('050-24');
    expect(result.inbox[0].groupedMemberCases).toEqual([
      {
        docketNumber: '150-24',
        inLeadCase: false,
        workItemId: 'wi-member-inbox',
      },
    ]);
  });

  it('should NOT group work items sharing a docketEntryId when the case was later removed from the consolidated group (multiDocketedOn has fewer than 2 entries)', () => {
    const firstItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-removed-from-group',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        multiDocketedOn: [{ docketNumber: '060-24' }],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '060-24',
      leadDocketNumber: '060-24',
    });
    const secondItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-removed-from-group',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        multiDocketedOn: [{ docketNumber: '160-24' }],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '160-24',
      leadDocketNumber: '160-24',
      workItemId: 'wi-second-removed',
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [firstItem, secondItem],
        },
      },
    });

    expect(result.inbox).toHaveLength(2);
    expect(result.inbox.every(item => !item.groupedMemberCases)).toBe(true);
  });

  it('should NOT group consolidated in-progress work items even when they share a docketEntryId', () => {
    const leadItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-consolidated-inprogress',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: false,
        multiDocketedOn: [
          { docketNumber: '060-24' },
          { docketNumber: '160-24' },
        ],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '060-24',
      leadDocketNumber: '060-24',
    });
    const memberItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-consolidated-inprogress',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: false,
        multiDocketedOn: [
          { docketNumber: '060-24' },
          { docketNumber: '160-24' },
        ],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '160-24',
      leadDocketNumber: '060-24',
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [leadItem, memberItem],
        },
      },
    });

    expect(result.inProgress).toHaveLength(2);
    result.inProgress.forEach(item => {
      expect(item.groupedMemberCases).toBeUndefined();
    });
  });

  it('should group consolidated processed (served) work items into a single row', () => {
    const leadItem = buildWorkItem({
      completedAt: '2024-01-20T10:00:00.000Z',
      completedByUserId: CLERK_USER_ID,
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-consolidated-processed',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        multiDocketedOn: [
          { docketNumber: '070-24' },
          { docketNumber: '170-24' },
        ],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '070-24',
      leadDocketNumber: '070-24',
    });
    const memberItem = buildWorkItem({
      completedAt: '2024-01-20T10:00:00.000Z',
      completedByUserId: CLERK_USER_ID,
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-consolidated-processed',
        documentType: 'Order',
        eventCode: 'O',
        isFileAttached: true,
        multiDocketedOn: [
          { docketNumber: '070-24' },
          { docketNumber: '170-24' },
        ],
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '170-24',
      leadDocketNumber: '070-24',
      workItemId: 'wi-member-processed',
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          servedWorkItems: [leadItem, memberItem],
        },
      },
    });

    expect(result.processed).toHaveLength(1);
    expect(result.processed[0].docketNumber).toBe('070-24');
    expect(result.processed[0].groupedMemberCases).toEqual([
      {
        docketNumber: '170-24',
        inLeadCase: false,
        workItemId: 'wi-member-processed',
      },
    ]);
  });

  it('should add a read-only document-view editLink to each formatted work item', () => {
    const inboxItem = buildWorkItem({
      docketEntry: {
        createdAt: '2024-01-15T12:00:00.000Z',
        docketEntryId: 'de-link-test',
        documentType: 'Petition',
        eventCode: 'P',
        isFileAttached: true,
        receivedAt: '2024-01-10T12:00:00.000Z',
      },
      docketNumber: '999-24',
    });

    const result = runCompute(docketClerkReportDocumentQcHelper, {
      state: {
        ...baseState,
        docketClerkReport: {
          ...baseState.docketClerkReport,
          inboxWorkItems: [inboxItem],
        },
      },
    });

    expect(result.inbox[0].editLink).toContain(
      '/case-detail/999-24/document-view',
    );
    expect(result.inbox[0].editLink).toContain('docketEntryId=de-link-test');
  });
});
