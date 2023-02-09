const {
  INITIAL_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0007-update-corporate-disclosure-document');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;

  it('should return and not modify records that are NOT docket records', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ];
    const results = await migrateItems(mockItems, documentClient);

    expect(results).toEqual(mockItems);
  });

  it('should return and not modify items that are docket entries but are NOT CDS', async () => {
    const mockItem = {
      documentTitle: 'Ownership Disclosure Statement',
      documentType: 'Ownership Disclosure Statement',
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const results = await migrateItems([mockItem], documentClient);

    expect(results[0]).toEqual({
      ...mockItem,
      documentTitle: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentTitle,
      documentType: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
    });
  });

  it('should return and modify records that are CDS docket entries', async () => {
    const mockItem = {
      documentTitle: 'Ownership Disclosure Statement',
      documentType: 'Ownership Disclosure Statement',
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const results = await migrateItems([mockItem], documentClient);

    expect(results[0]).toEqual({
      ...mockItem,
      documentTitle: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentTitle,
      documentType: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
    });
  });
});
