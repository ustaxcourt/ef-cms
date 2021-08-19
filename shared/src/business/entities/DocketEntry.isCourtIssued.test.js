const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('isCourtIssued', () => {
  it('should return false when the docketEntry.eventCode is NOT in the list of court issued documents', () => {
    const doc1 = new DocketEntry({ eventCode: 'PMT' }, { applicationContext });

    expect(doc1.isCourtIssued()).toBeFalsy();
  });

  it('should return true when the docketEntry.eventCode is in the list of court issued documents', () => {
    const doc1 = new DocketEntry({ eventCode: 'O' }, { applicationContext });

    expect(doc1.isCourtIssued()).toBeTruthy();
  });
});
