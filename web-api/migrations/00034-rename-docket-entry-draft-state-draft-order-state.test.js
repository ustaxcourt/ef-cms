const {
  up,
} = require('./00034-rename-docket-entry-draft-state-draft-order-state');
const { forAllRecords } = require('./utilities');

describe('renames draftState to draftOrderState', () => {
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
        draftState: { foo: 'bar' },
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

  it('mutates docket entry records, renaming the draftState property to draftOrderState', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).toHaveBeenCalledTimes(1);
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        draftOrderState: { foo: 'bar' },
        pk: 'case|95b46eae-70f0-45df-91de-febdc610fed9',
        sk: 'docket-entry|95b46eae-70f0-45df-91de-febdc610fed9',
      },
    });
  });
});
