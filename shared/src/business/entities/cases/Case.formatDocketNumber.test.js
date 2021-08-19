const { Case } = require('./Case');

describe('formatDocketNumber', () => {
  it('formats docket numbers with leading zeroes', () => {
    expect(Case.formatDocketNumber('00000456-19')).toEqual('456-19');
  });

  it('does not alter properly-formatted docket numbers', () => {
    expect(Case.formatDocketNumber('123456-19')).toEqual('123456-19'); // unchanged
  });

  it('strips letters from docket numbers', () => {
    expect(Case.formatDocketNumber('456-19L')).toEqual('456-19');
  });

  it('strips both leading zeroes and letters from docket numbers', () => {
    expect(Case.formatDocketNumber('00000456-19L')).toEqual('456-19');
  });

  it('does not error when a non docket number is given', () => {
    expect(Case.formatDocketNumber('FRED')).toEqual('FRED');
  });
});
