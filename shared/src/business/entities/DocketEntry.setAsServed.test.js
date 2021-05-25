const {
  A_VALID_DOCKET_ENTRY,
  MOCK_PETITIONERS,
} = require('./DocketEntry.test');
const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('setAsServed', () => {
  it('sets the Document as served', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
        draftOrderState: {
          documentContents: 'Yee to the haw',
        },
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );
    docketEntry.setAsServed();

    expect(docketEntry.servedAt).toBeDefined();
    expect(docketEntry.draftOrderState).toEqual(null);
  });

  it('sets the Document as served with served parties', () => {
    const docketEntry = new DocketEntry(
      {
        ...A_VALID_DOCKET_ENTRY,
      },
      { applicationContext, petitioners: MOCK_PETITIONERS },
    );

    docketEntry.setAsServed([
      {
        name: 'Served Party',
      },
    ]);

    expect(docketEntry.servedAt).toBeDefined();
    expect(docketEntry.servedParties).toMatchObject([{ name: 'Served Party' }]);
  });
});
