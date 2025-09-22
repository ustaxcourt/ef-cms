import { getHolidaysInDateRange } from './getHolidaysInDateRange';

describe('getHolidaysInDateRange', () => {
  const mockStartDate = '2025-12-20';
  const mockEndDate = '2025-12-30';

  it('gets the holidays between startDate and endDate', () => {
    const result = getHolidaysInDateRange(mockStartDate, mockEndDate);
    expect(result[0]).toMatchObject({
      dateString: '2025-12-25',
      name: 'Christmas Day',
    });
  });

  it('gets the holidays if startDate begins on a holiday', () => {
    const startDate = '2025-12-25';
    const result = getHolidaysInDateRange(startDate, mockEndDate);
    expect(result[0]).toMatchObject({
      dateString: '2025-12-25',
      name: 'Christmas Day',
    });
  });

  it('gets the holidays if endDate begins on a holiday', () => {
    const endDate = '2025-12-25';
    const result = getHolidaysInDateRange(mockStartDate, endDate);
    expect(result[0]).toMatchObject({
      dateString: '2025-12-25',
      name: 'Christmas Day',
    });
  });
});
