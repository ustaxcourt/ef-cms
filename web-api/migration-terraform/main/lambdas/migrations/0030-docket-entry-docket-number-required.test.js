const { migrateItems } = require('./0030-docket-entry-docket-number-required');

describe('migrateItems', () => {
  let documentClient;
  let mockDocketEntryRecordWithoutDocketNumber;

  const mockDocketNumber = '101-21';
  const mockDocketEntryId = 'f03ff1fa-6b53-4226-a61f-6ad36d25911c';

  beforeEach(() => {
    mockDocketEntryRecordWithoutDocketNumber = {
      createdAt: '2020-07-17T19:28:29.675Z',
      docketEntryId: mockDocketEntryId,
      documentType: 'Petition',
      eventCode: 'A',
      filedBy: 'Test Petitioner',
      pk: `case|${mockDocketNumber}`,
      receivedAt: '2020-07-17T19:28:29.675Z',
      sk: `docket-entry|${mockDocketEntryId}`,
      userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
    };
  });

  it('should return and not modify records that are NOT docket entry records', async () => {
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

  it('should return and not modify records that are docket entry records with an existing docketNumber', async () => {
    const items = [
      {
        ...mockDocketEntryRecordWithoutDocketNumber,
        docketNumber: '123-21',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        ...mockDocketEntryRecordWithoutDocketNumber,
        docketNumber: '123-21',
      },
    ]);
  });

  it('should modify the docket entry records and add docketNumber obtained from pk', async () => {
    const items = [mockDocketEntryRecordWithoutDocketNumber];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject({
      ...items[0],
      docketNumber: mockDocketNumber,
    });
  });
});
