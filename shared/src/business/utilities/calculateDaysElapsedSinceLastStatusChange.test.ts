import { mockEntireFile } from '@shared/test/mockFactory';
mockEntireFile({
  keepImplementation: true,
  module: '@shared/business/utilities/DateHandler',
});
import { calculateDaysElapsedSinceLastStatusChange } from './calculateDaysElapsedSinceLastStatusChange';
import { formatNow as formatNowMock } from '@shared/business/utilities/DateHandler';

describe('calculateDaysElapsedSinceLastStatusChange', () => {
  it('should return the number of days since the case status last changed and the day on which it was changed', () => {
    const mockToday = '2019-07-27T00:00:00.000-04:00';
    (formatNowMock as jest.Mock).mockReturnValue(mockToday);

    const result = calculateDaysElapsedSinceLastStatusChange(
      '2018-07-27T00:00:00.000-04:00',
    );

    expect(result).toEqual({
      daysElapsedSinceLastStatusChange: 365,
      statusDate: '07/27/18',
    });
  });
});
