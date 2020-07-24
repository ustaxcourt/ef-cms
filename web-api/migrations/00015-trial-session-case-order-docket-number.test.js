const { forAllRecords } = require('./utilities');
const { up } = require('./00015-trial-session-case-order-docket-number');

describe('replace caseId with docketNumber for each item in trialSession.caseOrder', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const DOCKET_NUMBER = '123-20';
  const records = [
    {
      caseDeadlineId: '95b46eae-70f0-45df-91de-febdc610fed9',
      caseId: 'e95ae96c-1b62-4531-862f-976e17ce6319',
      createdAt: '2019-08-22T12:47:16.905Z',
      deadlineDate: '2019-08-25T04:00:00.000Z',
      description: 'Final status report due to Judge Ashford',
      pk: 'case-deadline|95b46eae-70f0-45df-91de-febdc610fed9',
      sk: 'case-deadline|95b46eae-70f0-45df-91de-febdc610fed9',
    },
  ];

  beforeEach(() => {
    mockItems = [...records];
  });

  beforeAll(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          caseId: '832eca87-3571-42a1-8b62-ee379c6e462d',
          docketNumber: DOCKET_NUMBER,
        },
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should only modify records that are not TrialSession entities with items in caseOrder', async () => {
    mockItems = [
      {
        caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        caseOrder: [],
        maxCases: 5,
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
        trialSessionId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('does not modify trialSession.caseOrder items that already have a docketNumber', async () => {
    const anotherDocketNumber = '123-45';
    mockItems = [
      {
        caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        caseOrder: [{ docketNumber: anotherDocketNumber }],
        maxCases: 5,
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sessionType: 'Regular',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
        startDate: '3000-03-03',
        term: 'Spring',
        termYear: '3000',
        trialLocation: 'Under the Sea',
        trialSessionId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].caseOrder[0].docketNumber).toEqual(
      anotherDocketNumber,
    );
  });

  it('adds docketNumber to trialSession.caseOrder items when they do not already have one', async () => {
    mockItems = [
      {
        caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        caseOrder: [{ caseId: '832eca87-3571-42a1-8b62-ee379c6e462d' }],
        maxCases: 5,
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sessionType: 'Regular',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
        startDate: '3000-03-03',
        term: 'Spring',
        termYear: '3000',
        trialLocation: 'Under the Sea',
        trialSessionId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a9',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].caseOrder[0].docketNumber).toEqual(
      DOCKET_NUMBER,
    );
  });
});
