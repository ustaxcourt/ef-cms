const { A_VALID_DOCKET_ENTRY } = require('./DocketEntry.test');
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
      { applicationContext },
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
      { applicationContext },
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
