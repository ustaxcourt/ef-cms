const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteDocketEntry } = require('./deleteDocketEntry');

const mockDocketEntryId = '9b52c605-edba-41d7-b045-d5f992a499d3';
const mockDocketNumber = '999-99';

describe('deleteDocketEntry', () => {
  beforeAll(() => {
    applicationContext.filterCaseMetadata.mockImplementation(
      ({ cases }) => cases,
    );

    client.delete = jest.fn();
  });

  it('makes a delete request with the given docket entry data for the matching docketEntryId', async () => {
    await deleteDocketEntry({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: mockDocketNumber,
    });

    expect(client.delete.mock.calls[0][0]).toMatchObject({
      key: {
        pk: `case|${mockDocketNumber}`,
        sk: `docket-entry|${mockDocketEntryId}`,
      },
    });
  });
});
