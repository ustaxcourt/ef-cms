const { DocketRecord } = require('./DocketRecord');

describe('DocketRecord', () => {
  describe('validation', () => {
    it('returns false if a filingDate cannot be in the future.', () => {
      expect(
        new DocketRecord({
          filingDate: new Date('9000-01-01').toISOString(),
        }).isValid(),
      ).toBeFalsy();
    });
    it('returns true if a filingDate is not in the future', () => {
      expect(
        new DocketRecord({
          filingDate: new Date('2000-01-01').toISOString(),
        }).isValid(),
      ).toBeTruthy();
    });
    it('returns false if nothing is passed in', () => {
      expect(new DocketRecord({}).isValid()).toBeFalsy();
    });
  });
});
