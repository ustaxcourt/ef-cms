const { A_VALID_DOCKET_ENTRY } = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('archive', () => {
  it('archives the document', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      applicationContext,
    });

    expect(docketEntry.archived).toBeFalsy();

    docketEntry.archive();

    expect(docketEntry.archived).toBeTruthy();
  });
});
