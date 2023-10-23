import { DeadlineSearch } from './DeadlineSearch';

describe('DeadlineSearch', () => {
  it('creates a deadline search and initializes it', () => {
    const deadlineSearchEntity = new DeadlineSearch({
      endDate: '01/01/2000',
      startDate: '01/01/2000',
    });

    expect(deadlineSearchEntity.entityName).toEqual('DeadlineSearch');
    expect(deadlineSearchEntity.validate().toRawObject()).toMatchObject({
      endDate: '01/01/2000',
      startDate: '01/01/2000',
    });
  });

  describe('Start and End Date', () => {
    const date = '09/01/2023';

    it('should have validation errors when start date is not provided', () => {
      const deadlineSearch = new DeadlineSearch({
        endDate: date,
        startDate: undefined,
      });

      expect(deadlineSearch.getFormattedValidationErrors()).toMatchObject({
        startDate: 'Enter a Start date.',
      });
    });

    it('should have validation errors when end date is not provided', () => {
      const deadlineSearch = new DeadlineSearch({
        endDate: undefined,
        startDate: date,
      });

      expect(deadlineSearch.getFormattedValidationErrors()).toMatchObject({
        endDate: 'Enter an End date.',
      });
    });

    it('should have validation errors when the end date provided is chronologically before a valid start date', () => {
      const deadlineSearch = new DeadlineSearch({
        endDate: date,
        startDate: '09/29/2023',
      });

      expect(deadlineSearch.getFormattedValidationErrors()).toMatchObject({
        endDate:
          'End date cannot be prior to Start Date. Enter a valid End date.',
      });
    });
  });
});
