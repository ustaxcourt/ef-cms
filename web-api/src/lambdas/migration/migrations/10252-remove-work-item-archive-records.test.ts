import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
} from '@shared/business/entities/EntityConstants';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { migrateItems } from './10252-remove-work-item-archive-records';

describe('migrateItems', () => {
  let mockWorkItemArchiveRecord: TDynamoRecord<RawWorkItem>;
  beforeEach(() => {
    mockWorkItemArchiveRecord = {
      assigneeId: '123',
      assigneeName: 'someone',
      associatedJudge: 'some judge',
      associatedJudgeId: '345',
      caseIsInProgress: false,
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'abc123',
      completedAt: '2024-03-01T00:00:00.000Z',
      completedBy: 'someone nice',
      completedByUserId: '123',
      completedMessage: 'all done',
      createdAt: '2024-03-01T00:00:00.000Z',
      docketEntry: {},
      docketNumber: '101-45',
      docketNumberWithSuffix: '101-24S',
      entityName: 'WorkItem',
      gsi2pk: 'assigneeId|123',
      highPriority: false,
      inProgress: true,
      isInitializeCase: false,
      pk: 'user-outbox|123|2024-03-01-w5',
      section: DOCKET_SECTION,
      sentBy: 'george',
      sentBySection: DOCKET_SECTION,
      sentByUserId: '456',
      sk: '2024-03-01T00:00:00.000Z',
      updatedAt: '2024-03-01T00:00:00.000Z',
      workItemId: '567',
    };
  });

  it('does not migrate or pass along a a work item archive record', () => {
    const migratedItems = migrateItems([
      {
        ...mockWorkItemArchiveRecord,
        pk: 'user-outbox|123|2024-w5',
      },
    ]);

    expect(migratedItems).toEqual([]);
  });

  it('does not migrate or pass along a a work item archive record', () => {
    const migratedItems = migrateItems([
      {
        ...mockWorkItemArchiveRecord,
        pk: 'section-outbox|docket|2024-03-01',
      },
    ]);
    expect(migratedItems).toEqual([]);
  });
});
