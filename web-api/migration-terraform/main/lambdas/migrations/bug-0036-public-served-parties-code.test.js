const {
  MOCK_DOCUMENTS,
} = require('../../../../../shared/src/test/mockDocuments');
const {
  SERVED_PARTIES_CODES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./bug-0036-public-served-parties-code');

describe('migrateItems', () => {
  let mockDocketEntryItem;

  beforeEach(() => {
    mockDocketEntryItem = {
      ...MOCK_DOCUMENTS[2],
      pk: 'case|999-99',
      sk: 'docket-entry|d3989b49-dea9-4c1a-88fd-379b972032d8',
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
        sk: 'docket-entry|101-21',
      },
    ];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'docket-entry|101-21',
      },
    ]);
  });

  it('should not modify docket entries that do not have a servedParties array', async () => {
    const items = [
      {
        ...mockDocketEntryItem,
        servedAt: '',
        servedParties: undefined,
        servedPartiesCode: undefined,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].servedPartiesCode).toBeUndefined();
  });

  it('should not modify docket entries that do not have servedAt', async () => {
    const items = [
      {
        ...mockDocketEntryItem,
        servedAt: undefined,
        servedPartiesCode: undefined,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].servedPartiesCode).toBeUndefined();
  });

  it('should not modify docket entries that have a servedPartiesCode', async () => {
    const items = [
      {
        ...mockDocketEntryItem,
        servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].servedPartiesCode).toEqual(SERVED_PARTIES_CODES.BOTH);
  });

  it('should modify docket entries that do not have a servedPartiesCode', async () => {
    const items = [
      {
        ...mockDocketEntryItem,
        servedPartiesCode: undefined,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].servedPartiesCode).toBeDefined();
  });
});
