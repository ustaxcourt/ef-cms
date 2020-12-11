const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  fetchPendingItemsByDocketNumber,
} = require('./fetchPendingItemsByDocketNumber');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');

describe('fetchPendingItems', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
  });

  it('uses docketNumber filter and calls getCaseByDocketNumber and returns the pending items for that case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            docketEntryId: '5597987e-3e4f-4ce9-8c71-7ebd96bc9c70',
            index: 1,
            pending: false,
          },
          {
            ...MOCK_CASE.docketEntries[0],
            docketEntryId: '2568fa29-cc61-4570-800a-9bfc2b0abbc3',
            index: 2,
            pending: true,
            servedAt: '2019-08-25T05:00:00.000Z',
            servedParties: [
              {
                name: 'Bernard Lowe',
              },
            ],
          },
          {
            ...MOCK_CASE.docketEntries[0],
            docketEntryId: '69c399d7-0e8d-4e29-8825-1fbb1f63f042',
            index: 3,
            isLegacyServed: true,
            pending: true,
            servedAt: undefined,
            servedParties: undefined,
          },
          {
            ...MOCK_CASE.docketEntries[0],
            docketEntryId: '74efd6d9-6b7b-4f9f-b303-012723003192',
            index: 4,
            isLegacyServed: false,
            pending: true,
            servedAt: undefined,
            servedParties: undefined,
          },
        ],
      });

    const results = await fetchPendingItemsByDocketNumber({
      applicationContext,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();

    expect(results).toMatchObject([{ index: 2 }, { index: 3 }]);
  });
});
