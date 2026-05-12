import { BarNumberSearchValidation } from './BarNumberSearchValidation';
import type { RawBarNumberSearchValidation } from './BarNumberSearchValidation';

describe('BarNumberSearchValidation', () => {
  it('should pass validation for a valid bar number', () => {
    const entity = new BarNumberSearchValidation({ barNumber: 'AB1234' });
    expect(entity.getFormattedValidationErrors()).toBeNull();
  });

  it('should fail validation when bar number is missing', () => {
    const entity = new BarNumberSearchValidation({
      barNumber: undefined,
    } as unknown as RawBarNumberSearchValidation);
    expect(entity.getFormattedValidationErrors()).toEqual({
      barNumber: 'Enter a valid bar number',
    });
  });

  it('should fail validation when bar number contains special characters', () => {
    const entity = new BarNumberSearchValidation({ barNumber: 'AB-1234' });
    expect(entity.getFormattedValidationErrors()).toEqual({
      barNumber: 'Enter a valid bar number',
    });
  });

  it('should fail validation when bar number contains spaces', () => {
    const entity = new BarNumberSearchValidation({ barNumber: 'AB 1234' });
    expect(entity.getFormattedValidationErrors()).toEqual({
      barNumber: 'Enter a valid bar number',
    });
  });

  it('should fail validation when bar number contains only non-alphanumeric strings', () => {
    const entity = new BarNumberSearchValidation({ barNumber: '../' });
    expect(entity.getFormattedValidationErrors()).toEqual({
      barNumber: 'Enter a valid bar number',
    });
  });
});
