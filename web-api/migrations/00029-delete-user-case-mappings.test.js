const { forAllRecords } = require('./utilities');
const { up } = require('./00029-delete-user-case-mappings');

describe('delete user-case mappings using caseId instead of docketNumber', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;
  let mockItems = [];

  const DOCKET_NUMBER = '101-20';
  const CASE_ID = 'd4e78eb9-33cf-434b-a266-c2b51a909a6d';
  const USER_ID = '4bf4a134-e2cd-4c78-b3e6-b2570e17129e';

  const mockNewUserCaseRecord = {
    pk: `user|${USER_ID}`,
    sk: `case|${DOCKET_NUMBER}`,
  };
  const mockOldUserCaseRecord = {
    pk: `user|${USER_ID}`,
    sk: `case|${CASE_ID}`,
  };

  beforeEach(() => {
    mockItems = [mockNewUserCaseRecord, mockOldUserCaseRecord];

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    deleteStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    documentClient = {
      delete: deleteStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are NOT user-case records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should call delete on user-case records that do not use a docketNumber in the sk to reference the case', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
    expect(deleteStub.mock.calls.length).toEqual(1);
    expect(deleteStub.mock.calls[0][0].Key).toMatchObject(
      mockOldUserCaseRecord,
    );
  });
});
