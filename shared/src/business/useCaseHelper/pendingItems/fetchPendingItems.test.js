const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { fetchPendingItems } = require('./fetchPendingItems');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('fetchPendingItems', () => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
  });

  beforeEach(() => {
    const mockDataOne = {
      caseCaption: 'Test Petitioner, Petitioner',
      documents: [
        {
          documentId: 'def',
          pending: true,
        },
        {
          documentId: 'lmnop',
          pending: false,
        },
      ],
    };
    const mockDataTwo = {
      caseCaption: 'Another Test Petitioner, Petitioner',
      documents: [
        {
          documentId: 'abc',
          pending: true,
        },
        {
          documentId: 'xyz',
          pending: false,
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue([mockDataOne, mockDataTwo]);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue([mockDataOne, mockDataTwo]);
  });

  it('calls search function with correct params when provided a judge and returns records', async () => {
    const results = await fetchPendingItems({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();

    expect(results).toMatchObject([
      { documentId: 'def', pending: true },
      { documentId: 'abc', pending: true },
    ]);
  });

  it('calls search function and returns no records if cases lack documents', async () => {
    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue([
        {
          documents: undefined,
        },
      ]);
    const results = await fetchPendingItems({
      applicationContext,
      judge: 'Judge Armen',
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();
    expect(results.length).toEqual(0);
  });

  it('calls search function with correct params when not provided a judge and returns records', async () => {
    const results = await fetchPendingItems({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().fetchPendingItems,
    ).toHaveBeenCalled();

    expect(results).toMatchObject([
      { documentId: 'def', pending: true },
      { documentId: 'abc', pending: true },
    ]);
  });

  it('returns an empty array when no hits are returned from the search client', async () => {
    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue([]);

    const results = await fetchPendingItems({
      applicationContext,
    });

    expect(results.length).toEqual(0);
    expect(results).toMatchObject([]);
  });

  it('uses docketNumber filter and calls getCaseByDocketNumber and returns the pending items for that case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    const results = await fetchPendingItems({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();

    expect(results).toMatchObject([
      {
        associatedJudge: CHIEF_JUDGE,
        caseCaption: 'Test Petitioner, Petitioner',
        createdAt: '2018-11-21T20:49:28.192Z',
        docketNumberSuffix: null,
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        documentTitle: 'Proposed Stipulated Decision',
        documentType: 'Proposed Stipulated Decision',
        eventCode: 'PSDE',
        pending: true,
        processingStatus: 'pending',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        workItems: [],
      },
    ]);
  });
});
