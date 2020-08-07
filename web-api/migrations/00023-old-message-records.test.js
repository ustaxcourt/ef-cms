const { forAllRecords } = require('./utilities');
const { up } = require('./00023-old-message-records');

describe('delete old case message records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;
  let mockItems = [];

  const DOCKET_NUMBER = '101-20';
  const CASE_ID = 'd4e78eb9-33cf-434b-a266-c2b51a909a6d';
  const MESSAGE_ID = '4bf4a134-e2cd-4c78-b3e6-b2570e17129e';

  const mockNewCaseMessageRecord = {
    pk: `case|${DOCKET_NUMBER}`,
    sk: `message|${MESSAGE_ID}`,
  };
  const mockOldCaseMessageRecord = {
    pk: `case|${CASE_ID}`,
    sk: `message|${MESSAGE_ID}`,
  };

  beforeEach(() => {
    mockItems = [mockNewCaseMessageRecord, mockOldCaseMessageRecord];

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

  it('should not modify records that are NOT a case message', async () => {
    mockItems = [
      {
        pk: 'case|101-20',
        sk: 'case|101-20',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should call delete on case message records that do not use a docketNumber in the pk to reference the case', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
    expect(deleteStub.mock.calls.length).toEqual(1);
    expect(deleteStub.mock.calls[0][0].Key).toMatchObject(
      mockOldCaseMessageRecord,
    );
  });
});
