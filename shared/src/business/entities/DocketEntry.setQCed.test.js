const {
  A_VALID_DOCKET_ENTRY,
  MOCK_PETITIONERS,
} = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('setQCed', () => {
  it('updates the document QC information with user name, id, and date', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      applicationContext,
      petitioners: MOCK_PETITIONERS,
    });
    const user = {
      name: 'Jean Luc',
      userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
    };

    docketEntry.setQCed(user);

    expect(docketEntry.qcByUserId).toEqual(
      '02323349-87fe-4d29-91fe-8dd6916d2fda',
    );
    expect(docketEntry.qcAt).toBeDefined();
  });
});
