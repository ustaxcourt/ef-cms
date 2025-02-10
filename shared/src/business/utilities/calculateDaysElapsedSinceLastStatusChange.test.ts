import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { calculateDaysElapsedSinceLastStatusChange } from './calculateDaysElapsedSinceLastStatusChange';

describe('calculateDaysElapsedSinceLastStatusChange', () => {
  it('should return the number of days since the case status last changed and the day on which it was changed', () => {
    const mockToday = '2019-07-27T00:00:00.000-04:00';
    applicationContextForClient
      .getUtilities()
      .prepareDateFromString.mockReturnValue(mockToday);

    const result = calculateDaysElapsedSinceLastStatusChange(
      '2018-07-27T00:00:00.000-04:00',
    );

    expect(result).toEqual({
      daysElapsedSinceLastStatusChange: 365,
      statusDate: '07/27/18',
    });
  });
});
