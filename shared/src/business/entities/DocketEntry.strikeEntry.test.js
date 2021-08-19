const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('strikeEntry', () => {
  it('strikes a document if isOnDocketRecord is true', () => {
    const docketEntry = new DocketEntry(
      {
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filingDate: '9000-01-01T00:00:00.000Z',
        index: 1,
        isOnDocketRecord: true,
      },
      { applicationContext },
    );
    docketEntry.strikeEntry({
      name: 'Test User',
      userId: 'b07d648b-f5f3-4e81-bdb9-6e744f1d4125',
    });
    expect(docketEntry).toMatchObject({
      isStricken: true,
      strickenAt: expect.anything(),
      strickenBy: 'Test User',
      strickenByUserId: 'b07d648b-f5f3-4e81-bdb9-6e744f1d4125',
    });
  });

  it('throws an error if isOnDocketRecord is false', () => {
    const docketEntry = new DocketEntry(
      {
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filingDate: '9000-01-01T00:00:00.000Z',
        index: 1,
        isOnDocketRecord: false,
      },
      { applicationContext },
    );
    let error;
    try {
      docketEntry.strikeEntry({
        name: 'Test User',
        userId: 'b07d648b-f5f3-4e81-bdb9-6e744f1d4125',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toEqual(
      new Error('Cannot strike a document that is not on the docket record.'),
    );
    expect(docketEntry).toMatchObject({
      isStricken: false,
      strickenAt: undefined,
      strickenBy: undefined,
      strickenByUserId: undefined,
    });
  });
});
