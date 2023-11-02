import { CASE_STATUS_TYPES, DOCKET_SECTION } from './EntityConstants';
import { OutboxItem, RawOutboxItem } from './OutboxItem';
import { applicationContext } from '../test/createTestApplicationContext';

describe('OutboxItem', () => {
  const validOutboxItem = {
    assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
    caseIsInProgress: false,
    caseStatus: CASE_STATUS_TYPES.new,
    caseTitle: 'Johnny Joe Jacobson',
    completedAt: '2018-11-21T20:49:28.192Z',
    completedBy: '8b4cd447-6278-461b-b62b-d9e357eea62c',
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntry: {} as any,
    docketNumber: '101-18',
    entityName: 'OutboxItem',
    highPriority: false,
    inProgress: false,
    leadDocketNumber: '101-20',
    section: DOCKET_SECTION,
    trialDate: '2018-11-21T20:49:28.192Z',
    workItemId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
  } as RawOutboxItem;

  describe('isValid', () => {
    it('should throw an error if app context is not passed in', () => {
      expect(() => new OutboxItem({} as any, {} as any)).toThrow();
    });

    it('Creates a valid OutboxItem', () => {
      const outboxItem = new OutboxItem(validOutboxItem, {
        applicationContext,
      });
      expect(outboxItem.isValid()).toBeTruthy();
    });

    it('should fail validation when fields are missing', () => {
      const outboxItem = new OutboxItem(
        {
          ...validOutboxItem,
          section: undefined,
        } as any,
        { applicationContext },
      );
      expect(outboxItem.isValid()).toBeFalsy();
    });
  });

  it('is set high priority if case is calendared', () => {
    const outboxItem = new OutboxItem(
      {
        ...validOutboxItem,
        caseStatus: CASE_STATUS_TYPES.calendared,
      },
      { applicationContext },
    );
    expect(outboxItem.highPriority).toBe(true);
  });

  it('is set high priority if item is manually set as high priority', () => {
    const outboxItem = new OutboxItem(
      {
        ...validOutboxItem,
        highPriority: true,
      },
      { applicationContext },
    );
    expect(outboxItem.highPriority).toBe(true);
  });

  it('Creates a workItem containing a docketEntry with only the picked fields', () => {
    const outboxItem = new OutboxItem(
      {
        ...validOutboxItem,
        caseStatus: CASE_STATUS_TYPES.new,
        caseTitle: 'Johnny Joe Jacobson',
        docketEntry: {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentTitle: 'Proposed Stipulated Decision',
          documentType: 'Proposed Stipulated Decision',
          editState: {},
          eventCode: 'PSDE',
          filedBy: 'Test Petitioner',
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 5,
          isFileAttached: true,
          isLegacyServed: false,
          processingStatus: 'pending',
          receivedAt: '2018-03-01T00:01:00.000Z',
          servedAt: '2019-08-25T05:00:00.000Z',
        } as any,
        docketNumber: '101-18',
        leadDocketNumber: '101-18',
        section: DOCKET_SECTION,
      },
      { applicationContext },
    );
    expect(outboxItem.docketEntry.docketNumber).toBeUndefined();
    expect(outboxItem.docketEntry.editState).toBeUndefined();
    expect(outboxItem.docketEntry.processingStatus).toBeUndefined();
    expect(outboxItem.docketEntry.createdAt).toBeUndefined();
    expect(outboxItem.docketEntry.documentTitle).toBeUndefined();
    expect(outboxItem.docketEntry.filingDate).toBeUndefined();
    expect(outboxItem.docketEntry.index).toBeUndefined();
    expect(outboxItem.docketEntry.processingStatus).toBeUndefined();
    expect(outboxItem.docketEntry.receivedAt).toBeUndefined();
    expect(outboxItem.docketEntry.documentType).toEqual(
      'Proposed Stipulated Decision',
    );
    expect(outboxItem.leadDocketNumber).toEqual('101-18');
  });
});
