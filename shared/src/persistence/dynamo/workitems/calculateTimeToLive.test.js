import {
  createISODateString,
  subtractISODates,
} from '../../../business/utilities/DateHandler';

const { calculateTimeToLive } = require('./calculateTimeToLive');

describe('calculateTimeToLive', () => {
  const now = createISODateString();
  console.log(now);
  it('should return 0 if passed in date is eight days ago', () => {
    expect(calculateTimeToLive(subtractISODates(now, { day: 8 }))).toBe(0);
  });

  it('should return a negative value if date passed in is greater than eight days ago', () => {
    expect(
      calculateTimeToLive(subtractISODates(now, { day: 100 })),
    ).toBeLessThan(0);
  });

  it('should return a positive number if date passed in is less than eight days ago', () => {
    expect(
      calculateTimeToLive(subtractISODates(now, { day: 3 })),
    ).toBeGreaterThan(0);
  });
});
