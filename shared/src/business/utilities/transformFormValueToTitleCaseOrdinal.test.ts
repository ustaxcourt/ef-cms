import { transformFormValueToTitleCaseOrdinal } from './transformFormValueToTitleCaseOrdinal';

describe('transformFormValueToTitleCaseOrdinal', () => {
  it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
    const results = transformFormValueToTitleCaseOrdinal(50);
    expect(results).toEqual('Fiftieth');
  });

  it('should return early when otherIteration is empty', () => {
    const results = transformFormValueToTitleCaseOrdinal('');
    expect(results).toEqual(undefined);
  });

  it('should capitalize all words in the title including after a hyphen, except "and"', () => {
    const results = transformFormValueToTitleCaseOrdinal(321);
    expect(results).toEqual('Three Hundred and Twenty-First');
  });
});
