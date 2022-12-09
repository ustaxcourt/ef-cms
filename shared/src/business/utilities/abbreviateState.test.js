const { abbreviateState } = require('./abbreviateState');

describe('abbreviateState', () => {
  it('should return a string with an abbreviated state when passed a comma separated city and unabbreviated state', () => {
    const locationString = 'Denver, Colorado';
    const expectedResult = 'Denver, CO';

    const result = abbreviateState(locationString);

    expect(result).toEqual(expectedResult);
  });
});
