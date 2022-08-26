const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { processEntries } = require('./processEntries');
const { processOtherEntries } = require('./processOtherEntries');
jest.mock('./processEntries');

describe('processOtherEntries', () => {
  const mockOtherRecord = {
    docketEntryId: { S: '123' },
    entityName: { S: 'OtherEntry' },
    pk: { S: 'other-entry|123' },
    sk: { S: 'other-entry|123' },
  };

  it('should make a call to processEntries to process the provided other records', async () => {
    await processOtherEntries({
      applicationContext,
      otherRecords: [mockOtherRecord],
    });

    expect(processEntries.mock.calls[0][0]).toMatchObject({
      recordType: 'otherRecords',
      records: [mockOtherRecord],
    });
  });
});
