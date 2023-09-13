import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { preparedDateToISOString } from './preparedDateToISOString';

describe('preparedDateToISOString', () => {
  const dateToFormat = '2019-12-02';
  const undefinedDateToFormat = undefined;

  it('should return an ISO Date String when given a date string', () => {
    expect(preparedDateToISOString(applicationContext, dateToFormat)).toEqual(
      '2019-12-02T05:00:00.000Z',
    );
  });

  it('should return a null when dateToFormat is undefined', () => {
    expect(
      preparedDateToISOString(applicationContext, undefinedDateToFormat),
    ).toEqual(null);
  });

  it('should return a null when not passed a date string', () => {
    expect(preparedDateToISOString(applicationContext, 3)).toEqual(null);
  });
});
