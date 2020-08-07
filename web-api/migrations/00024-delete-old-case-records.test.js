const { forAllRecords } = require('./utilities');
const { up } = require('./00024-delete-old-case-records');

describe('delete old case records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;
  let mockItems = [];

  const DOCKET_NUMBER = '101-20';
  const CASE_ID = 'd4e78eb9-33cf-434b-a266-c2b51a909a6d';
  const DOCUMENT_ID = '4bf4a134-e2cd-4c78-b3e6-b2570e17129e';

  const mockNewCaseRecord = {
    pk: `case|${DOCKET_NUMBER}`,
    sk: `document|${DOCUMENT_ID}`,
  };
  const mockOldCaseRecord = {
    pk: `case|${CASE_ID}`,
    sk: `document|${DOCUMENT_ID}`,
  };

  beforeEach(() => {
    mockItems = [mockNewCaseRecord, mockOldCaseRecord];

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

  it('should not modify records that are NOT case records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should call delete on case records that do not use a docketNumber in the pk to reference the case', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
    expect(deleteStub.mock.calls.length).toEqual(1);
    expect(deleteStub.mock.calls[0][0].Key).toMatchObject(mockOldCaseRecord);
  });
});
