const { getCasesByLeadCaseId } = require('./getCasesByLeadCaseId');

describe('getCasesByLeadCaseId', () => {
  let applicationContext;
  let queryStub;

  it('attempts to retrieve the cases by leadCaseId', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [
          {
            pk: '123',
            sk: 'abc',
          },
        ],
      }),
    }));

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'abc',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(result).toEqual([
      {
        docketRecord: [{ pk: '123', sk: 'abc' }],
        documents: [{ pk: '123', sk: 'abc' }],
        irsPractitioners: [{ pk: '123', sk: 'abc' }],
        pk: '123',
        privatePractitioners: [{ pk: '123', sk: 'abc' }],
        sk: 'abc',
      },
    ]);
  });

  it('returns an empty array when no items are returned', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [],
      }),
    }));

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };

    const result = await getCasesByLeadCaseId({
      applicationContext,
      leadCaseId: 'abc',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
