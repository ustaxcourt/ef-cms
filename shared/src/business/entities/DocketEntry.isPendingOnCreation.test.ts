const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry } = require('./DocketEntry');

describe('isPendingOnCreation', () => {
  beforeAll(() => {
    jest.spyOn(DocketEntry, 'isPendingOnCreation');
  });

  afterAll(() => {
    DocketEntry.isPendingOnCreation.mockRestore();
  });

  it('respects any defined "pending" value', () => {
    const raw1 = { eventCode: 'FOO', pending: true };
    const doc1 = new DocketEntry(raw1, { applicationContext });
    expect(doc1.pending).toBeTruthy();

    const raw2 = { eventCode: 'FOO', pending: false };
    const doc2 = new DocketEntry(raw2, { applicationContext });
    expect(doc2.pending).toBeFalsy();

    expect(DocketEntry.isPendingOnCreation).not.toHaveBeenCalled();
  });

  it('sets pending to false for non-matching event code', () => {
    const raw1 = { eventCode: 'ABC' };
    const doc1 = new DocketEntry(raw1, { applicationContext });
    expect(doc1.pending).toBe(false);

    expect(DocketEntry.isPendingOnCreation).toHaveBeenCalled();

    const raw2 = { color: 'blue', sport: 'Ice Hockey' };
    const doc2 = new DocketEntry(raw2, { applicationContext });
    expect(doc2.pending).toBe(false);

    expect(DocketEntry.isPendingOnCreation).toHaveBeenCalled();
  });

  it('sets pending to true for known list of matching event codes', () => {
    const raw1 = {
      category: 'Motion',
      documentType: 'some kind of motion',
      eventCode: 'M006',
    };
    const doc1 = new DocketEntry(raw1, { applicationContext });
    expect(doc1.pending).toBeTruthy();

    const raw2 = {
      documentType: 'it is a proposed stipulated decision',
      eventCode: 'PSDE',
    };
    const doc2 = new DocketEntry(raw2, { applicationContext });
    expect(doc2.pending).toBeTruthy();

    const raw3 = {
      documentType: 'it is an order to show cause',
      eventCode: 'OSC',
    };
    const doc3 = new DocketEntry(raw3, { applicationContext });
    expect(doc3.pending).toBeTruthy();

    const raw4 = {
      category: 'Application',
      documentType: 'Application for Waiver of Filing Fee',
      eventCode: 'APW',
    };
    const doc4 = new DocketEntry(raw4, { applicationContext });
    expect(doc4.pending).toBeTruthy();
  });
});
