const createApplicationContext = require('../../../../src/applicationContext');
const {
  MOCK_DOCUMENTS,
} = require('../../../../../shared/src/test/mockDocuments');
const { migrateItems } = require('./0038-parse-generated-orders');
const applicationContext = createApplicationContext({});

describe('migrateItems', () => {
  let mockDocketEntry;

  beforeEach(() => {
    applicationContext.environment.documentsBucketName = 'test-test';
    applicationContext.getPersistenceGateway = () => ({
      getDocument: jest.fn(),
      saveDocumentFromLambda: jest.fn(),
    });
    applicationContext.getUseCaseHelpers = () => ({
      parseAndScrapePdfContents: jest.fn(),
    });
    applicationContext.logger = () => ({
      error: jest.fn(),
    });

    mockDocketEntry = {
      ...MOCK_DOCUMENTS[0],
      documentContentsId: '555fa90a-f96f-44ec-9b75-459bc1feeb07',
      pk: 'case|101-21',
      sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
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

    const results = await migrateItems(items);

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
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().parseAndScrapePdfContents,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
  });

  it('should return and not modify records that are docket entries that are not orders', async () => {
    const items = [mockDocketEntry];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().parseAndScrapePdfContents,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
  });

  it('should return and not modify records that are legacy order docket entries', async () => {
    const items = [
      {
        ...mockDocketEntry,
        eventCode: 'O',
        isLegacy: true,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().parseAndScrapePdfContents,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
  });

  it('should return and not modify records that are not legacy order docket entries without a documentContentsId', async () => {
    const items = [
      {
        ...mockDocketEntry,
        documentContentsId: undefined,
        eventCode: 'O',
        isLegacy: true,
      },
    ];

    const results = await migrateItems(items);
    expect(results).toEqual(items);
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().parseAndScrapePdfContents,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
  });

  it.only('should return and modify records that are not legacy order docket entries with a documentContentsId', async () => {
    const items = [
      {
        ...mockDocketEntry,
        eventCode: 'O',
        isLegacy: false,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().parseAndScrapePdfContents,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
  });

  it.skip('should log an error when parsing pdf fails', async () => {
    const items = [
      {
        ...mockDocketEntry,
        eventCode: 'O',
        isLegacy: false,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });
});
