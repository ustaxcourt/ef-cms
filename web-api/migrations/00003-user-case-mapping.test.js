const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00003-user-case-mapping');
const { UserCase } = require('../../shared/src/business/entities/UserCase');

describe('user case mapping migration', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;

  const mockUserCaseItem = {
    pk: 'user|6805d1ab-18d0-43ec-bafb-654e83405416',
    sk: `case|${MOCK_CASE.caseId}`,
  };

  const mockUserCaseEntity = new UserCase(MOCK_CASE).validate().toRawObject();

  const mockNewUserCaseItem = {
    gsi1pk: `user-case|${MOCK_CASE.caseId}`,
    pk: 'user|6805d1ab-18d0-43ec-bafb-654e83405416',
    sk: `case|${MOCK_CASE.caseId}`,
    ...mockUserCaseEntity,
  };

  const mockCaseWithKeys = {
    ...MOCK_CASE,
    pk: `case|${MOCK_CASE.caseId}`,
    sk: `case|${MOCK_CASE.caseId}`,
  };

  beforeEach(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockUserCaseItem],
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: mockCaseWithKeys,
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not update the item when it is not a user-case record', async () => {
    documentClient.scan = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockCaseWithKeys],
      }),
    });

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toHaveBeenCalled();
  });

  it('should not update the item when its a new user-case record', async () => {
    documentClient.scan = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockNewUserCaseItem],
      }),
    });

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toHaveBeenCalled();
  });

  it('should update the item', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(1);
  });
});
