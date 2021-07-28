const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./devex-0037-combine-work-items');

describe('migrateItems', () => {
  const mockWorkItemId = 'd86724f9-d189-4f9f-99af-1773d2be4c5f';
  const mockDocketEntryId = '130c7c03-aa55-46e4-b8a3-bb0c31f86cc3';
  const mockWorkItem = {
    assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
    assigneeName: 'bob',
    caseStatus: CASE_STATUS_TYPES.new,
    caseTitle: 'Johnny Joe Jacobson',
    docketEntry: { docketEntryId: mockDocketEntryId },
    docketNumber: '101-21',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    section: DOCKET_SECTION,
    sentBy: 'bob',
    workItemId: mockWorkItemId,
  };
  let documentClient,
    mockCaseWorkItemRecord,
    mockWorkItemRecord,
    mockDocketEntryRecord;

  beforeEach(() => {
    mockCaseWorkItemRecord = {
      pk: 'case|101-21',
      sk: `work-item|${mockWorkItemId}`,
    };
    mockWorkItemRecord = {
      ...mockWorkItem,
      pk: `work-item|${mockWorkItemId}`,
      sk: `work-item|${mockWorkItemId}`,
    };
    mockDocketEntryRecord = {
      pk: 'case|101-21',
      sk: `docket-entry|${mockDocketEntryId}`,
      workItem: mockWorkItem,
    };

    documentClient = {
      get: jest.fn().mockReturnValue({
        promise: async () => ({
          Item: mockWorkItemRecord,
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT work item or docket entry records', async () => {
    const items = [
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ]);
  });

  it('should add full work item record to case work item record if it does not already contain a workItemId', async () => {
    const items = [mockCaseWorkItemRecord];

    const results = await migrateItems(items, documentClient);

    expect(documentClient.get.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: `work-item|${mockWorkItemId}`,
        sk: `work-item|${mockWorkItemId}`,
      },
    });

    expect(results[0]).toMatchObject({
      ...mockWorkItem,
      gsi1pk: `work-item|${mockWorkItemId}`,
      pk: 'case|101-21',
      sk: `work-item|${mockWorkItemId}`,
    });
  });

  it('should not return case work item record if a matching full work item record cannot be found', async () => {
    const items = [mockCaseWorkItemRecord];

    documentClient = {
      get: jest.fn().mockReturnValue({
        promise: async () => ({
          Item: undefined,
        }),
      }),
    };

    const results = await migrateItems(items, documentClient);

    expect(documentClient.get).toHaveBeenCalled();
    expect(results).toEqual([]);
  });

  it('should return and not modify case work item record if it already contains a workItemId', async () => {
    const items = [{ ...mockWorkItem, ...mockCaseWorkItemRecord }];

    const results = await migrateItems(items, documentClient);

    expect(documentClient.get).not.toHaveBeenCalled();

    expect(results).toEqual(items);
  });

  it('should not return full work item records', async () => {
    const items = [mockWorkItemRecord];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([]);
  });

  it('should remove workItem from docket entry record', async () => {
    const items = [mockDocketEntryRecord];

    const results = await migrateItems(items, documentClient);

    expect(results[0].workItem).toBeUndefined();
  });
});
