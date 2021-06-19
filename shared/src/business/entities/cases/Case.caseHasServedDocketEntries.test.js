const { caseHasServedDocketEntries } = require('./Case');

describe('caseHasServedDocketEntries', () => {
  it('should return true if the case has any docket entry with isLegacyServed set to true', () => {
    expect(
      caseHasServedDocketEntries({
        docketEntries: [{ isLegacyServed: true }],
      }),
    ).toBeTruthy();
  });

  it('should return true if the case has any docket entry with servedAt defined', () => {
    expect(
      caseHasServedDocketEntries({
        docketEntries: [{ servedAt: '2019-08-25T05:00:00.000Z' }],
      }),
    ).toBeTruthy();
  });

  it('should return false if the case does not have any docket entries with isLegacyServed set to true or servedAt', () => {
    expect(
      caseHasServedDocketEntries({
        docketEntries: [{ isLegacyServed: false }],
      }),
    ).toBeFalsy();
  });

  it('should return false if the case does not have any docket entries', () => {
    expect(
      caseHasServedDocketEntries({
        docketEntries: [],
      }),
    ).toBeFalsy();
  });
});
