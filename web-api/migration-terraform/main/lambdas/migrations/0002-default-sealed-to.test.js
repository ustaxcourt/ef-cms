const {
  DOCKET_ENTRY_SEALED_TO_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  MOCK_DOCUMENTS,
} = require('../../../../../shared/src/test/mockDocuments');
const { migrateItems } = require('./0002-default-sealed-to');

describe('migrateItems', () => {
  let mockDocketEntryItem;
  let documentClient;

  beforeEach(() => {
    mockDocketEntryItem = {
      ...MOCK_DOCUMENTS[0],
      isLegacySealed: true,
      isSealed: true,
      pk: `case|${MOCK_DOCUMENTS[0].docketNumber}`,
      sealedTo: undefined,
      sk: `docket-entry|${MOCK_DOCUMENTS[0].docketEntryId}`,
    };
  });

  it('should return and not modify records that are NOT docket entry records', async () => {
    const items = [
      {
        pk: 'case|101-10',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|102-20',
        sk: 'case|102-20',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: 'case|101-10',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|102-20',
        sk: 'case|102-20',
      },
    ]);
  });

  it('should default sealedTo to "External" if the docket entry was legacy sealed', async () => {
    const items = [mockDocketEntryItem];

    const results = await migrateItems(items, documentClient);

    expect(results[0].sealedTo).toEqual(DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL);
  });

  it('should not set sealedTo when the docket entry is not sealed', async () => {
    const items = [
      { ...mockDocketEntryItem, isLegacySealed: false, isSealed: false },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].sealedTo).toBeUndefined();
  });
});
