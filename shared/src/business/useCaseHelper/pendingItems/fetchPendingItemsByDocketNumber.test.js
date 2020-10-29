const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  fetchPendingItemsByDocketNumber,
} = require('./fetchPendingItemsByDocketNumber');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('fetchPendingItems', () => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
  });

  it('uses docketNumber filter and calls getCaseByDocketNumber and returns the pending items for that case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    const results = await fetchPendingItemsByDocketNumber({
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
        docketEntryId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
        docketNumberSuffix: null,
        documentTitle: 'Proposed Stipulated Decision',
        documentType: 'Proposed Stipulated Decision',
        eventCode: 'PSDE',
        pending: true,
        processingStatus: 'pending',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });
});
