import { createISODateString, FORMATS } from './DateHandler';
import { getHolidaysInDateRange } from './getHolidaysInDateRange';

describe('getHolidaysInDateRange', () => {
  const mockStartDate = createISODateString('12/22/2025', FORMATS.MMDDYYYY);
  const mockEndDate = createISODateString('12/26/2025', FORMATS.MMDDYYYY);

  it('gets the holidays between startDate and endDate', () => {
    const result = getHolidaysInDateRange(mockStartDate, mockEndDate);
    expect(result[0]).toMatchObject({
      dateString: '2025-12-25',
      name: 'Christmas Day',
    });
  });
  it('throws error if start date is not ISO', () => {
    const startDate = '12/22/2025';
    expect(() => getHolidaysInDateRange(startDate, mockEndDate)).toThrow();
  });
  it('throws error if end date is not ISO', () => {
    const endDate = '12/26/2025';
    expect(() => getHolidaysInDateRange(mockStartDate, endDate)).toThrow();
  });
});
