import { DocketNumberSearchValidation } from './DocketNumberSearchValidation';

describe('DocketNumberSearchValidation', () => {
  it('should pass validation for a valid docket number', () => {
    const entity = new DocketNumberSearchValidation({
      docketNumber: '12345-23',
    });
    expect(entity.getFormattedValidationErrors()).toBeNull();
  });

  it('should fail validation when docket number is missing', () => {
    const entity = new DocketNumberSearchValidation({
      docketNumber: undefined,
    });
    expect(entity.getFormattedValidationErrors()).toEqual({
      docketNumber: 'Enter a valid docket number',
    });
  });

  it('should fail validation for an incorrectly formatted docket number', () => {
    const entity = new DocketNumberSearchValidation({
      docketNumber: '123-456',
    });
    expect(entity.getFormattedValidationErrors()).toEqual({
      docketNumber: 'Enter a valid docket number',
    });
  });

  it('should fail validation when docket number starts with 0', () => {
    const entity = new DocketNumberSearchValidation({
      docketNumber: '0123-45',
    });
    expect(entity.getFormattedValidationErrors()).toEqual({
      docketNumber: 'Enter a valid docket number',
    });
  });

  it('should fail validation when docket number contains only non-alphanumeric strings', () => {
    const entity = new DocketNumberSearchValidation({ docketNumber: '../' });
    expect(entity.getFormattedValidationErrors()).toEqual({
      docketNumber: 'Enter a valid docket number',
    });
  });
});
