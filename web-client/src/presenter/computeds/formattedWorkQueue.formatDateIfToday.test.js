import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formatDateIfToday } from './formattedWorkQueue';

describe('formatDateIfToday', () => {
  const currentTime = applicationContext.getUtilities().createISODateString();
  const yesterday = applicationContext
    .getUtilities()
    .calculateISODate({ dateString: currentTime, howMuch: -1 });

  it('returns a time if the date is today', () => {
    const result = formatDateIfToday(currentTime, applicationContext);

    expect(result).toContain(':');
    expect(result).toContain('ET');
    expect(result).not.toContain('/');
  });

  it('returns "Yesterday" if the date is yesterday', () => {
    const result = formatDateIfToday(yesterday, applicationContext);

    expect(result).toEqual('Yesterday');
  });

  it('returns the formatted date if older than one day', () => {
    const date = applicationContext
      .getUtilities()
      .formatDateString('2019-01-01T17:29:13.122Z');

    const result = formatDateIfToday(date, applicationContext);

    expect(result).toContain('01/01/19');
  });
});
