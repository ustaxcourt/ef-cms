const { forAllRecords } = require('./utilities');
const { up } = require('./00032-document-docket-entry-sk');

describe('update document| sk to use docket-entry|', () => {
  let documentClient;
  let scanStub;
  let putStub;

  beforeAll(() => {
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

    documentClient = {
      put: putStub,
      scan: scanStub,
    };
  });

  it('only mutates records with an sk that includes `document|`', async () => {
    await up(documentClient, '', forAllRecords);
    expect(putStub).toHaveBeenCalledTimes(1);
  });

  it('updates the sk from `document|` to `docket-entry|`', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'docket-entry|95b46eae-70f0-45df-91de-febdc610fed9',
      },
    });
  });
});
