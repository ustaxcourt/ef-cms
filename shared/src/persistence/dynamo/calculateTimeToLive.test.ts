import {
  FORMATS,
  createISODateString,
  formatDateString,
  subtractISODates,
} from '../../business/utilities/DateHandler';

import { calculateTimeToLive } from './calculateTimeToLive';

describe('calculateTimeToLive', () => {
  const now = createISODateString();

  it('should return 0 if passed in date is eight days ago', () => {
    const eightDaysAgo = subtractISODates(now, { day: 8 });
    const ttl = calculateTimeToLive({ numDays: 8, timestamp: eightDaysAgo });
    expect(ttl.numSeconds).toBe(0);
    expect(ttl.expirationTimestamp).toBe(
      8 * 86400 +
        Number(formatDateString(eightDaysAgo, FORMATS.UNIX_TIMESTAMP_SECONDS)),
    );
  });

  it('should return a negative value if date passed in is greater than eight days ago', () => {
    const oneHundredDaysAgo = subtractISODates(now, { day: 100 });
    const ttl = calculateTimeToLive({
      numDays: 8,
      timestamp: oneHundredDaysAgo,
    });
    expect(ttl.numSeconds).toBeLessThan(0);
    expect(ttl.expirationTimestamp).toBe(
      8 * 86400 +
        Number(
          formatDateString(oneHundredDaysAgo, FORMATS.UNIX_TIMESTAMP_SECONDS),
        ),
    );
  });

  it('should return a positive number if date passed in is less than eight days ago', () => {
    const threeDaysAgo = subtractISODates(now, { day: 3 });
    const ttl = calculateTimeToLive({ numDays: 8, timestamp: threeDaysAgo });

    expect(ttl.numSeconds).toBeGreaterThan(0);
    expect(ttl.expirationTimestamp).toBe(
      8 * 86400 +
        Number(formatDateString(threeDaysAgo, FORMATS.UNIX_TIMESTAMP_SECONDS)),
    );
  });
});
