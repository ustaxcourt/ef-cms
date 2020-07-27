const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00016-lead-docket-number');

describe('replace leadCaseId with leadDocketNumber on consolidated cases', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const LEAD_CASE_ID = '08c17bc7-35e3-4ac3-977d-0fbc3d9d913f';
  const LEAD_DOCKET_NUMBER = '123-20';
  const mockCaseWithKeys = {
    ...MOCK_CASE,
    pk: `case|${MOCK_CASE.caseId}`,
    sk: `case|${MOCK_CASE.caseId}`,
  };
  const mockCaseWithLeadCaseId = {
    ...mockCaseWithKeys,
    leadCaseId: LEAD_CASE_ID,
  };

  beforeEach(() => {
    mockItems = [mockCaseWithLeadCaseId];
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
          caseId: LEAD_CASE_ID,
          docketNumber: LEAD_DOCKET_NUMBER,
        },
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not modify non-case records', async () => {
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

  it('should not modify case records that do not have a leadCaseId', async () => {
    mockItems = [mockCaseWithKeys];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify case records that have a leadCaseId and also a leadDocketNumber', async () => {
    mockItems = [{ ...mockCaseWithKeys, leadDocketNumber: '101-20' }];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should add leadDocketNumber if item is a case record and has a leadCaseId', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].leadDocketNumber).toEqual(
      LEAD_DOCKET_NUMBER,
    );
  });

  it('should not add leadDocketNumber if item is a case record and has a leadCaseId but retrieving the lead case does not return a docketNumber', async () => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          caseId: LEAD_CASE_ID,
        },
      }),
    });

    documentClient.get = getStub;

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not add leadDocketNumber if item is a case record and has a leadCaseId but retrieving the lead case does not return Item', async () => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    documentClient.get = getStub;

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });
});
