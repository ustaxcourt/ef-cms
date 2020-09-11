const { forAllRecords } = require('./utilities');
const { up } = require('./00035-correspondence-id');

describe('renames correspondenceId to documentId', () => {
  let documentClient;
  let scanStub;
  let putStub;

  const DOCUMENT_ID = '56ab686e-bf8f-4de9-a405-5f7ce8f9ca98';

  beforeAll(() => {
    const records = [
      {
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
      },
      {
        documentId: DOCUMENT_ID,
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: `correspondence|${DOCUMENT_ID}`,
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

    documentClient = {
      put: putStub,
      scan: scanStub,
    };
  });

  it('mutates only correspondence records, setting the new correspondenceId to the old documentId', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).toHaveBeenCalledTimes(1);
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        correspondenceId: DOCUMENT_ID,
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: `correspondence|${DOCUMENT_ID}`,
      },
    });
  });
});
