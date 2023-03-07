const {
  transformFormValueToTitleCaseOrdinal,
} = require('./transformFormValueToTitleCaseOrdinal');

describe('transformFormValueToTitleCaseOrdinal', () => {
  it('should generate title with an otherIteration defined when ordinalValue is "Other"', () => {
    const results = transformFormValueToTitleCaseOrdinal(50);
    expect(results).toEqual('Fiftieth');
  });
});
