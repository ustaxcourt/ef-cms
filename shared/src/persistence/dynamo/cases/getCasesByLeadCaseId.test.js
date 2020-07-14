const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../../business/entities/EntityConstants');
const { getCasesByLeadCaseId } = require('./getCasesByLeadCaseId');

describe('getCasesByLeadCaseId', () => {
  it('attempts to retrieve the cases by leadCaseId', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => ({
        Items: [
          {
            caseId: 'abc',
          },
        ],
      }),
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue({
        caseId: '123',
        docketRecord: [],
        documents: [],
        irsPractitioners: [],
        pk: 'case|123',
        privatePractitioners: [],
        sk: 'case|123',
        status: CASE_STATUS_TYPES.new,
      });

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'case|123',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
    expect(result).toEqual([
      {
        caseId: '123',
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
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => ({
        Items: [],
      }),
    });

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'abc',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).not.toHaveBeenCalled();
    expect(applicationContext.isAuthorizedForWorkItems).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
