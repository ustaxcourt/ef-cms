const { forAllRecords } = require('./utilities');
const { up } = require('./00014-case-deadlines-docket-number');

describe('add docketNumber to case deadlines', () => {
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

  it('adds docketNumber to case deadline if it is not already present', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].docketNumber).toEqual(
      DOCKET_NUMBER,
    );
  });

  it('does not call putStub if caseRecord is not found by the caseId', async () => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {},
      }),
    });

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('does not modify case deadlines if they already have a docketNumber', async () => {
    mockItems = [
      {
        caseDeadlineId: '95b46eae-70f0-45df-91de-febdc610fed9',
        createdAt: '2019-08-22T12:47:16.905Z',
        deadlineDate: '2019-08-25T04:00:00.000Z',
        description: 'Final status report due to Judge Ashford',
        docketNumber: '102-20',
        pk: 'case-deadline|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'case-deadline|95b46eae-70f0-45df-91de-febdc610fed9',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('does not modify records that are not case deadlines', async () => {
    mockItems = [
      {
        caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });
});
