import {
  CASE_STATUS_TYPES,
  DOCKET_SECTION,
} from '@shared/business/entities/EntityConstants';
import { RawWorkItem } from '@shared/business/entities/WorkItem';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { migrateItems } from './10252-add-gsis-to-work-items';

describe('migrateItems', () => {
  const gsiUserBoxKey = 'gsiUserBox';
  const gsiSectionBoxKey = 'gsiSectionBox';

  let mockWorkItemRecord: TDynamoRecord<RawWorkItem>;
  beforeEach(() => {
    mockWorkItemRecord = {
      assigneeId: '123',
      assigneeName: 'someone',
      associatedJudge: 'some judge',
      associatedJudgeId: '345',
      caseIsInProgress: false,
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      caseTitle: 'abc123',
      completedAt: undefined,
      createdAt: '2024-03-01T00:00:00.000Z',
      docketEntry: {},
      docketNumber: '101-45',
      docketNumberWithSuffix: '101-24S',
      entityName: 'WorkItem',
      gsi2pk: 'assigneeId|123',
      highPriority: false,
      inProgress: true,
      isInitializeCase: false,
      pk: 'case|101-45',
      section: DOCKET_SECTION,
      sentBy: 'george',
      sentBySection: DOCKET_SECTION,
      sentByUserId: '456',
      sk: 'work-item|101-45',
      updatedAt: '2024-03-01T00:00:00.000Z',
      workItemId: '567',
    };
  });

  it('unsets the gsi2pk on a work item record that has it', () => {
    mockWorkItemRecord = {
      ...mockWorkItemRecord,
      gsi2pk: 'something',
    };

    const migratedItems = migrateItems([mockWorkItemRecord]);

    expect(migratedItems).toEqual([
      {
        ...mockWorkItemRecord,
        gsi2pk: undefined,
      },
    ]);
  });

  describe('completed', () => {
    beforeEach(() => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        completedAt: '2024-03-01T00:00:00.000Z',
      };
    });

    it('does not add a gsiUserBox or gsiSectionBox on a work item record that has completedAt', () => {
      const migratedItems = migrateItems([mockWorkItemRecord]);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          gsi2pk: undefined,
          [gsiSectionBoxKey]: undefined,
          [gsiUserBoxKey]: undefined,
        },
      ]);
    });
  });

  describe('inProgress', () => {
    it('adds gsiUserBox on a work item record that has an assigneeId', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        assigneeId: '123',
        inProgress: true,
      };

      const migratedItems = migrateItems([mockWorkItemRecord]);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          gsi2pk: undefined,
          [gsiUserBoxKey]: 'assigneeId|inProgress|123',
        },
      ]);
    });

    it('adds gsiUserBox on a work item record that has caseIsInProgress and an assigneeId', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        assigneeId: '123',
        caseIsInProgress: true,
      };

      const migratedItems = migrateItems([mockWorkItemRecord]);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          gsi2pk: undefined,
          [gsiUserBoxKey]: 'assigneeId|inProgress|123',
        },
      ]);
    });

    it('adds gsiSectionBox on a work item record that has a inProgress and a section', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        inProgress: true,
        section: DOCKET_SECTION,
      };

      const migratedItems = migrateItems([mockWorkItemRecord]);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          gsi2pk: undefined,
          [gsiSectionBoxKey]: `section|inProgress|${DOCKET_SECTION}`,
        },
      ]);
    });

    it('adds gsiSectionBox on a work item record that has a caseIsInProgress and a section', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        assigneeId: '123',
        caseIsInProgress: true,
        section: DOCKET_SECTION,
      };

      const migratedItems = migrateItems([mockWorkItemRecord]);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          gsi2pk: undefined,
          [gsiSectionBoxKey]: `section|inProgress|${DOCKET_SECTION}`,
        },
      ]);
    });

    it('does not add a gsiUserBox on a work item record that does not have an assigneeId specified', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        assigneeId: undefined,
        inProgress: true,
      } as any;
      const records = [mockWorkItemRecord];

      const migratedItems = migrateItems(records);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          [gsiUserBoxKey]: undefined,
        },
      ]);
    });

    it('does not add a gsiSectionBox on a work item record that does not have a section specified', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        inProgress: true,
        section: undefined,
      } as any;
      const records = [mockWorkItemRecord];

      const migratedItems = migrateItems(records);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          [gsiSectionBoxKey]: undefined,
        },
      ]);
    });
  });

  describe('inbox (not in progress)', () => {
    it('adds gsiUserBox on a work item record has an assigneeId', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        assigneeId: '123',
        caseIsInProgress: false,
        inProgress: false,
      };

      const records = [mockWorkItemRecord];

      const migratedItems = migrateItems(records);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          [gsiUserBoxKey]: `assigneeId|inbox|${mockWorkItemRecord.assigneeId}`,
        },
      ]);
    });

    it('adds gsiSectionBox on a work item record that has a section', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        caseIsInProgress: false,
        inProgress: false,
        section: DOCKET_SECTION,
      };
      const records = [mockWorkItemRecord];

      const migratedItems = migrateItems(records);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          [gsiSectionBoxKey]: `section|inbox|${DOCKET_SECTION}`,
        },
      ]);
    });

    it('does not add a gsiUserBox on a work item record that does not have an assigneeId specified', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        assigneeId: undefined,
        caseIsInProgress: false,
        inProgress: false,
      } as any;
      const records = [mockWorkItemRecord];

      const migratedItems = migrateItems(records);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          [gsiUserBoxKey]: undefined,
        },
      ]);
    });

    it('does not add a gsiSectionBox on a work item record that does not have a section specified', () => {
      mockWorkItemRecord = {
        ...mockWorkItemRecord,
        caseIsInProgress: false,
        inProgress: false,
        section: undefined,
      } as any;
      const records = [mockWorkItemRecord];

      const migratedItems = migrateItems(records);

      expect(migratedItems).toEqual([
        {
          ...mockWorkItemRecord,
          [gsiSectionBoxKey]: undefined,
        },
      ]);
    });
  });
  describe('completed', () => {});
});
