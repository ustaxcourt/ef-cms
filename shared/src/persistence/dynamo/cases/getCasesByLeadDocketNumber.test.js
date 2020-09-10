const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { getCasesByLeadDocketNumber } = require('./getCasesByLeadDocketNumber');

describe('getCasesByLeadDocketNumber', () => {
  it('attempts to retrieve the cases by leadDocketNumber', async () => {
    applicationContext.getDocumentClient().query.mockReturnValueOnce({
      promise: async () => ({
        Items: [
          {
            docketNumber: '101-20',
          },
        ],
      }),
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        docketEntries: [],
        irsPractitioners: [],
        pk: 'case|123-20',
        privatePractitioners: [],
        sk: 'case|123-20',
        status: CASE_STATUS_TYPES.new,
      });

    const result = await getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: '123-20',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(result).toEqual([
      {
        docketEntries: [],
        irsPractitioners: [],
        pk: 'case|123-20',
        privatePractitioners: [],
        sk: 'case|123-20',
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });

  it('returns an empty array when no items are returned', async () => {
    applicationContext.getDocumentClient().query.mockReturnValueOnce({
      promise: async () => ({
        Items: [],
      }),
    });

    const result = await getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: '123-20',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
