import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processEntries } from './processEntries';
import { processOtherEntries } from './processOtherEntries';
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

    expect((processEntries as jest.Mock).mock.calls[0][0]).toMatchObject({
      recordType: 'otherRecords',
      records: [mockOtherRecord],
    });
  });
});
