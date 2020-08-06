const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00019-user-case-note-mapping');

describe('add docketNumber to user case note record mappings', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = [];

  const mockUserCaseNoteWithDocketNumber = {
    docketNumber: MOCK_CASE.docketNumber,
    notes: 'Test note',
    pk: `user-case-note|${MOCK_CASE.caseId}`,
    sk: `user|${MOCK_CASE.userId}`,
    userId: MOCK_CASE.userId,
  };

  beforeEach(() => {
    mockItems = [mockUserCaseNoteWithDocketNumber];

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

  it('should not modify records that are NOT a UserCaseNote entity', async () => {
    mockItems = [
      {
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should get case by caseId when the item is a UserCaseNote entity', async () => {
    await up(documentClient, '', forAllRecords);

    expect(getStub.mock.calls[0][0]['Key']).toMatchObject({
      pk: `case|${MOCK_CASE.caseId}`,
      sk: `case|${MOCK_CASE.caseId}`,
    });
  });

  it("should update the item's pk to use docketNumber instead of caseId", async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      pk: `user-case-note|${mockUserCaseNoteWithDocketNumber.docketNumber}`,
      sk: `user|${mockUserCaseNoteWithDocketNumber.userId}`,
    });
  });

  it('should not modify records if caseId cannot be obtained from the gsi1pk', async () => {
    mockItems = [
      {
        ...mockUserCaseNoteWithDocketNumber,
        pk: 'user-case-note',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify records if caseRecord is empty', async () => {
    getStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });
    documentClient.get = getStub;

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });
});
