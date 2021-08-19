const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { updateDocketEntry } = require('./updateDocketEntry');

const mockDocketEntryId = '9b52c605-edba-41d7-b045-d5f992a499d3';
const mockDocketNumber = '101-20';

const mockDocument = {
  docketEntryId: mockDocketEntryId,
  documentTitle: 'Title of le Document',
  filedBy: 'The one and only, Guy Fieri',
  status: 'complete',
};

describe('updateDocketEntry', () => {
  it('makes put request with the given document data for the matching document id', async () => {
    await updateDocketEntry({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
      document: mockDocument,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        ...mockDocument,
        pk: `case|${mockDocketNumber}`,
        sk: `docket-entry|${mockDocketEntryId}`,
      },
    });
  });
});
