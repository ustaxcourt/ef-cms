import { formatDateIfToday } from './formattedWorkQueue';
import {
  calculateISODate,
  createISODateString,
  formatDateString,
} from '@shared/business/utilities/DateHandler';

describe('formatDateIfToday', () => {
  const currentTime = createISODateString();
  const yesterday = calculateISODate({ dateString: currentTime, howMuch: -1 });

  it('returns a time if the date is today', () => {
    const result = formatDateIfToday(currentTime);

    expect(result).toContain(':');
    expect(result).toContain('ET');
    expect(result).not.toContain('/');
  });

  it('returns "Yesterday" if the date is yesterday', () => {
    const result = formatDateIfToday(yesterday);

    expect(result).toEqual('Yesterday');
  });

  it('returns the formatted date if older than one day', () => {
    const date = formatDateString('2019-01-01T17:29:13.122Z');

    const result = formatDateIfToday(date);

    expect(result).toContain('01/01/19');
  });
});
