import { abbreviateState } from './abbreviateState';

describe('abbreviateState', () => {
  it('should return a string with an abbreviated state when passed a comma separated city and unabbreviated state', () => {
    const locationString = 'Denver, Colorado';
    const expectedResult = 'Denver, CO';

    const result = abbreviateState(locationString);

    expect(result).toEqual(expectedResult);
  });

  it('should return a string with an abbreviated state when passed a multi word city and unabbreviated state', () => {
    const locationString = 'Las Vegas, Nevada';
    const expectedResult = 'Las Vegas, NV';

    const result = abbreviateState(locationString);

    expect(result).toEqual(expectedResult);
  });
});
