const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00017-user-case-note-docket-number');

describe('add docketNumber to user case notes', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = [];

  const mockUserCaseNoteWithDocketNumber = {
    docketNumber: MOCK_CASE.docketNumber,
    notes: 'Test note',
    pk: `user-case-note|${MOCK_CASE.caseId}`,
    sk: `user|${MOCK_CASE.caseId}`,
    userId: MOCK_CASE.userId,
  };
  const mockUserCaseNoteWithoutDocketNumber = {
    notes: 'Test note',
    pk: `user-case-note|${MOCK_CASE.caseId}`,
    sk: `user|${MOCK_CASE.caseId}`,
    userId: MOCK_CASE.userId,
  };

  beforeEach(() => {
    mockItems = [mockUserCaseNoteWithoutDocketNumber];

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
          caseId: MOCK_CASE.caseId,
          docketNumber: MOCK_CASE.docketNumber,
        },
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are are NOT a UserCaseNote entity', async () => {
    mockItems = [
      {
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify UserCaseNote records that already have a docketNumber', async () => {
    mockItems = [mockUserCaseNoteWithDocketNumber];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not add docketNumber when item is a UserCaseNote record and does not have a docketNumber but retrieving the case record does not return Item', async () => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });
    documentClient.get = getStub;

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it("should not add docketNumber when item is a UserCaseNote record and doesn't have a docketNumber but retrieving the case record does not return a docketNumber", async () => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          caseId: MOCK_CASE.caseId,
        },
      }),
    });
    documentClient.get = getStub;

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it("should add docketNumber when item is a UserCaseNote record and the case it's associated with has a docketNumber", async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].docketNumber).toEqual(
      MOCK_CASE.docketNumber,
    );
  });
});
