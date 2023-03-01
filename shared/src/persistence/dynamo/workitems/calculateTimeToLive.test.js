import {
  createISODateString,
  subtractISODates,
} from '../../../business/utilities/DateHandler';

const { calculateTimeToLive } = require('./calculateTimeToLive');

describe('calculateTimeToLive', () => {
  const now = createISODateString();
  const eightDaysAgo = subtractISODates(now, { day: 8 });

  it('should return 0 if passed in date is eight days ago', () => {
    expect(calculateTimeToLive({ numDays: 8, timestamp: eightDaysAgo })).toBe(
      0,
    );
  });

  it('should return a negative value if date passed in is greater than eight days ago', () => {
    const oneHundredDaysAgo = subtractISODates(now, { day: 100 });
    expect(
      calculateTimeToLive({ numDays: 8, timestamp: oneHundredDaysAgo }),
    ).toBeLessThan(0);
  });

  it('should return a positive number if date passed in is less than eight days ago', () => {
    const threeDaysAgo = subtractISODates(now, { day: 3 });
    expect(
      calculateTimeToLive({ numDays: 8, timestamp: threeDaysAgo }),
    ).toBeGreaterThan(0);
  });
});
