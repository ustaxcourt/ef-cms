const { forAllRecords } = require('./utilities');
const { up } = require('./00033-delete-document-records');

describe('delete document records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;

  beforeEach(() => {
    const records = [
      {
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
      },
      {
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'document|95b46eae-70f0-45df-91de-febdc610fed9',
      },
      {
        pk: 'case-deadline|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'case-deadline|95b46eae-70f0-45df-91de-febdc610fed9',
      },
      {
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'docket-entry|95b46eae-70f0-45df-91de-febdc610fed9',
      },
    ];

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: records,
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

  it('should only remove document records', async () => {
    await up(documentClient, '', forAllRecords);

    expect(deleteStub).toHaveBeenCalledTimes(1);
    expect(deleteStub.mock.calls[0][0].Key).toMatchObject({
      pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
      sk: 'document|95b46eae-70f0-45df-91de-febdc610fed9',
    });
  });
});
