const { getCasesByLeadCaseId } = require('./getCasesByLeadCaseId');

describe('getCasesByLeadCaseId', () => {
  let applicationContext;
  let getCaseByCaseIdStub;
  let isAuthorizedForWorkItemsStub;
  let queryStub;

  it('attempts to retrieve the cases by leadCaseId', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [
          {
            caseId: '123',
            docketRecord: [],
            documents: [],
            pk: 'case|123',
            practitioners: [],
            respondents: [],
            sk: 'case|123',
            status: 'New',
          },
        ],
      }),
    }));

    getCaseByCaseIdStub = jest.fn().mockResolvedValue([]);
    isAuthorizedForWorkItemsStub = jest.fn().mockReturnValue(true);

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdStub,
      }),
      isAuthorizedForWorkItems: isAuthorizedForWorkItemsStub,
    };

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'case|123',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(getCaseByCaseIdStub).toHaveBeenCalled();
    expect(result).toEqual([
      {
<<<<<<< HEAD
        caseId: '123',
        docketRecord: [],
        documents: [],
        pk: 'case|123',
        practitioners: [],
        respondents: [],
        sk: 'case|123',
        status: 'New',
=======
        docketRecord: [{ pk: '123', sk: 'abc' }],
        documents: [{ pk: '123', sk: 'abc' }],
        irsPractitioners: [{ pk: '123', sk: 'abc' }],
        pk: '123',
        privatePractitioners: [{ pk: '123', sk: 'abc' }],
        sk: 'abc',
>>>>>>> develop
      },
    ]);
  });

  it('returns an empty array when no items are returned', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [],
      }),
    }));

    getCaseByCaseIdStub = jest.fn().mockResolvedValue([]);
    isAuthorizedForWorkItemsStub = jest.fn().mockReturnValue(true);

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
      getPersistenceGateway: () => ({
        getCaseByCaseId: getCaseByCaseIdStub,
      }),
      isAuthorizedForWorkItems: isAuthorizedForWorkItemsStub,
    };

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'abc',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(getCaseByCaseIdStub).not.toHaveBeenCalled();
    expect(isAuthorizedForWorkItemsStub).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
