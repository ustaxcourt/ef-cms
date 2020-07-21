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
      caseId: '1',
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
      caseId: '2',
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
      .getCaseByCaseId.mockReturnValue([mockDataOne, mockDataTwo]);
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
      { caseId: '1', documentId: 'def', pending: true },
      { caseId: '2', documentId: 'abc', pending: true },
    ]);
  });

  it('calls search function and returns no records if cases lack documents', async () => {
    applicationContext
      .getPersistenceGateway()
      .fetchPendingItems.mockReturnValue([
        {
          caseId: '1',
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
      { caseId: '1', documentId: 'def', pending: true },
      { caseId: '2', documentId: 'abc', pending: true },
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

  it('uses caseId filter and calls getCaseByCaseId and returns the pending items for that case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);

    const results = await fetchPendingItems({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
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
