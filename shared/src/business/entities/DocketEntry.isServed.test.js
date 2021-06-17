const { applicationContext } = require('../test/createTestApplicationContext');
const { DocketEntry, isServed } = require('./DocketEntry');

describe('isServed', () => {
  it('should return false when servedAt is undefined and isLegacyServed is false', () => {
    const doc1 = new DocketEntry(
      { isLegacyServed: undefined, servedAt: undefined },
      { applicationContext },
    );

    expect(isServed(doc1)).toBeFalsy();
  });

  it('should return true when servedAt is defined', () => {
    const doc1 = new DocketEntry(
      { isLegacyServed: undefined, servedAt: '2020-07-17T19:28:29.675Z' },
      { applicationContext },
    );

    expect(isServed(doc1)).toBeTruthy();
  });

  it('should return true when servedAt is undefined and isLegacyServed is true', () => {
    const doc1 = new DocketEntry(
      { isLegacyServed: true, servedAt: undefined },
      { applicationContext },
    );

    expect(isServed(doc1)).toBeTruthy();
  });
});
