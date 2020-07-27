const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { getCasesByLeadDocketNumber } = require('./getCasesByLeadDocketNumber');

describe('getCasesByLeadDocketNumber', () => {
  const CASE_ID = 'cd7706c1-f9ab-47ab-b5ff-601e26ad5b8c';

  it('attempts to retrieve the cases by leadDocketNumber', async () => {
    applicationContext
      .getDocumentClient()
      .query.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Items: [
              {
                pk: `case|${CASE_ID}`,
                sk: `case|${CASE_ID}`,
              },
            ],
          }),
      })
      .mockReturnValueOnce({
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
        docketRecord: [],
        documents: [],
        irsPractitioners: [],
        pk: 'case|123',
        privatePractitioners: [],
        sk: 'case|123',
        status: CASE_STATUS_TYPES.new,
      });

    const result = await getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: 'case|123',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(result).toEqual([
      {
        docketRecord: [],
        documents: [],
        irsPractitioners: [],
        pk: 'case|123',
        privatePractitioners: [],
        sk: 'case|123',
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });

  it('returns an empty array when no items are returned', async () => {
    applicationContext
      .getDocumentClient()
      .query.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Items: [
              {
                pk: `case|${CASE_ID}`,
                sk: `case|${CASE_ID}`,
              },
            ],
          }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [],
        }),
      });

    const result = await getCasesByLeadDocketNumber({
      applicationContext,
      leadDocketNumber: 'abc',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
    expect(applicationContext.isAuthorizedForWorkItems).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
