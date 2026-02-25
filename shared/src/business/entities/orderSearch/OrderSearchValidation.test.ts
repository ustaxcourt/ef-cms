import { OrderSearchValidation } from './OrderSearchValidation';
import { calculateISODate } from '@shared/business/utilities/DateHandler';

describe('OrderSearchValidation', () => {
  it('should be valid with no dates provided', () => {
    const entity = new OrderSearchValidation({
      endDate: undefined,
      startDate: undefined,
    });
    expect(entity.getFormattedValidationErrors()).toEqual(null);
  });

  it('should be valid with a valid startDate in ISO format', () => {
    const entity = new OrderSearchValidation({
      endDate: undefined,
      startDate: '2020-01-01T05:00:00.000Z',
    });
    expect(entity.getFormattedValidationErrors()).toEqual(null);
  });

  it('should be valid with both startDate and endDate where endDate >= startDate', () => {
    const entity = new OrderSearchValidation({
      endDate: '2020-06-01T04:00:00.000Z',
      startDate: '2020-01-01T05:00:00.000Z',
    });
    expect(entity.getFormattedValidationErrors()).toEqual(null);
  });

  it('should be invalid when startDate is in the future', () => {
    const futureDate = calculateISODate({ howMuch: 5, units: 'days' });
    const entity = new OrderSearchValidation({
      endDate: undefined,
      startDate: futureDate,
    });
    const errors = entity.getFormattedValidationErrors();
    expect(errors!.startDate).toContain('future');
  });

  it('should be invalid when endDate is before startDate', () => {
    const entity = new OrderSearchValidation({
      endDate: '2020-01-01T05:00:00.000Z',
      startDate: '2020-06-01T04:00:00.000Z',
    });
    const errors = entity.getFormattedValidationErrors();
    expect(errors!.endDate).toContain('prior to start date');
  });

  it('should be valid when endDate is provided without startDate', () => {
    const entity = new OrderSearchValidation({
      endDate: '2020-06-01T04:00:00.000Z',
      startDate: undefined,
    });
    expect(entity.getFormattedValidationErrors()).toEqual(null);
  });

  it('should be invalid when endDate is in the future and no startDate', () => {
    const futureDate = calculateISODate({ howMuch: 5, units: 'days' });
    const entity = new OrderSearchValidation({
      endDate: futureDate,
      startDate: undefined,
    });
    const errors = entity.getFormattedValidationErrors();
    expect(errors!.endDate).toContain('future');
  });

  it('should be invalid when startDate is not a valid ISO date format', () => {
    const entity = new OrderSearchValidation({
      endDate: undefined,
      startDate: 'not-a-date',
    });
    const errors = entity.getFormattedValidationErrors();
    expect(errors!.startDate).toBeDefined();
  });
});
