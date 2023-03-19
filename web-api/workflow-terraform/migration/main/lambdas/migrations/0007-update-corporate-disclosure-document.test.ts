import { INITIAL_DOCUMENT_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../../shared/src/test/mockCase';
import { migrateItems } from './0007-update-corporate-disclosure-document';

describe('migrateItems', () => {
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
    const results = await migrateItems(mockItems);

    expect(results).toEqual(mockItems);
  });

  it('should NOT modify docket entry items that do NOT have documentType "Ownership Disclosure Statement"', async () => {
    const mockItem = {
      documentTitle: 'Answer',
      documentType: 'Answer',
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual(mockItem);
  });

  it('should modify docket entry items with documentType "Ownership Disclosure Statement", updating documentType', async () => {
    const mockItem = {
      documentTitle: 'Ownership Disclosure Statement',
      documentType: 'Ownership Disclosure Statement',
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual({
      ...mockItem,
      documentType: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
    });
  });

  it('should modify docket entry items with documentType "Order for Ownership Disclosure Statement", updating documentType', async () => {
    const mockItem = {
      documentTitle: 'ORDER FOR CORPORATE DISCLOSURE STATEMENT BY 12/03/58',
      documentType: 'Order for Ownership Disclosure Statement',
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual({
      ...mockItem,
      documentType: 'Order for Corporate Disclosure Statement',
    });
  });

  it('should modify docket entry items with previousDocument that has documentType "Ownership Disclosure Statement", updating documentType', async () => {
    const mockItem = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      previousDocument: {
        documentTitle: 'Ownership Disclosure Statement',
        documentType: 'Ownership Disclosure Statement',
      },
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual({
      ...mockItem,
      previousDocument: {
        ...mockItem.previousDocument,
        documentType: INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
      },
    });
  });

  it('should modify docket entry items with previousDocument that has documentType "Order for Ownership Disclosure Statement", updating documentType', async () => {
    const mockItem = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      previousDocument: {
        documentTitle: 'Order for Ownership Disclosure Statement',
        documentType: 'Order for Ownership Disclosure Statement',
      },
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual({
      ...mockItem,
      previousDocument: {
        ...mockItem.previousDocument,
        documentType: 'Order for Corporate Disclosure Statement',
      },
    });
  });

  it('should modify case items that have property "orderForOds"', async () => {
    const mockItem = {
      orderForOds: true,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual({
      ...mockItem,
      orderForCds: true,
    });
  });

  it('should modify case items that have property "orderForOds", updating the property name to "orderForCds" and retaining the original value', async () => {
    const mockItem = {
      orderForOds: false,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual({
      ...mockItem,
      orderForCds: false,
    });
  });

  it('should NOT modify case items that do not have property "orderForOds"', async () => {
    const mockItem = {
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };

    const results = await migrateItems([mockItem]);

    expect(results[0]).toEqual(mockItem);
  });
});
