import { DateTime } from 'luxon';
import {
  GenerateSuggestedTermForm,
  RawGenerateSuggestedTermForm,
} from '@shared/business/entities/trialSessions/GenerateSuggestedTermForm';

describe('GenerateSuggestedTermForm', () => {
  const CURRENT_YEAR = DateTime.now().year;
  const VALID_TERM_FORM: RawGenerateSuggestedTermForm = {
    termStartDate: `01/01/${CURRENT_YEAR + 1}`,
    termEndDate: `03/31/${CURRENT_YEAR + 1}`,
    termName: 'TEST_TERM_NAME',
    maxSessionsPerLocation: 1,
    maxSessionsPerWeek: 1,
    smallCaseMinimumQuantity: 1,
    smallCaseMaxQuantity: 1,
    regularCaseMinimumQuantity: 1,
    regularCaseMaxQuantity: 1,
    hybridCaseMinimumQuantity: 1,
    hybridCaseMaxQuantity: 1,
  };

  it('should create an entity with the cirrect entity name', () => {
    const { entityName } = new GenerateSuggestedTermForm({});
    expect(entityName).toEqual('GenerateSuggestedTermForm');
  });

  describe('LEGACY PROPERTIES', () => {
    it('should contain extended class properties', () => {
      const entity = new GenerateSuggestedTermForm(VALID_TERM_FORM);
      const errors = entity.getFormattedValidationErrors();

      expect(errors).toEqual(null);

      const { termStartDate, termEndDate, termName } = entity;
      expect(termStartDate).toEqual(VALID_TERM_FORM.termStartDate);
      expect(termEndDate).toEqual(VALID_TERM_FORM.termEndDate);
      expect(termName).toEqual(VALID_TERM_FORM.termName);
    });
  });

  describe('VALIDATIONS', () => {
    it('should return an error message when "smallCaseMaxQuantity" is less than "smallCaseMinimumQuantity"', () => {
      const entity = new GenerateSuggestedTermForm({
        ...VALID_TERM_FORM,
        smallCaseMaxQuantity: 1,
        smallCaseMinimumQuantity: 2,
      });
      const errors = entity.getFormattedValidationErrors();

      expect(errors).toEqual({
        smallCaseMaxQuantity:
          'Small case max quantity must be greater than or equal to the Small case minimum quantity.',
      });
    });

    it('should return an error message when "regularCaseMaxQuantity" is less than "regularCaseMinimumQuantity"', () => {
      const entity = new GenerateSuggestedTermForm({
        ...VALID_TERM_FORM,
        regularCaseMaxQuantity: 1,
        regularCaseMinimumQuantity: 2,
      });
      const errors = entity.getFormattedValidationErrors();

      expect(errors).toEqual({
        regularCaseMaxQuantity:
          'Regular case max quantity must be greater than or equal to the Regular case minimum quantity.',
      });
    });

    it('should return an error message when "hybridCaseMaxQuantity" is less than "hybridCaseMinimumQuantity"', () => {
      const entity = new GenerateSuggestedTermForm({
        ...VALID_TERM_FORM,
        hybridCaseMaxQuantity: 1,
        hybridCaseMinimumQuantity: 2,
      });
      const errors = entity.getFormattedValidationErrors();

      expect(errors).toEqual({
        hybridCaseMaxQuantity:
          'Hybrid case max quantity must be greater than or equal to the Hybrid case minimum quantity.',
      });
    });

    it('should return an error message when "maxSessionsPerLocation" is negative', () => {
      const entity = new GenerateSuggestedTermForm({
        ...VALID_TERM_FORM,
        maxSessionsPerLocation: -1,
      });

      const errors = entity.getFormattedValidationErrors();

      expect(errors).toEqual({
        maxSessionsPerLocation: 'Max sessions per location cannot be negative.',
      });
    });

    [
      'maxSessionsPerLocation',
      'maxSessionsPerWeek',
      'smallCaseMinimumQuantity',
      'regularCaseMinimumQuantity',
      'hybridCaseMinimumQuantity',
    ].forEach((prop: string) => {
      it(`should return an error message when "${prop}" is negative`, () => {
        const entity = new GenerateSuggestedTermForm({
          ...VALID_TERM_FORM,
          [prop]: -1,
        });

        const errors = entity.getFormattedValidationErrors()!;
        expect(Object.keys(errors)).toEqual([prop]);

        const { [prop]: validationKey } = errors;

        expect(validationKey).toContain('cannot be negative');
      });
    });

    [
      'maxSessionsPerLocation',
      'maxSessionsPerWeek',
      'smallCaseMinimumQuantity',
      'smallCaseMaxQuantity',
      'regularCaseMinimumQuantity',
      'regularCaseMaxQuantity',
      'hybridCaseMinimumQuantity',
      'hybridCaseMaxQuantity',
    ].forEach((prop: string) => {
      it(`should return an error message when "${prop}" is not a number`, () => {
        const entity = new GenerateSuggestedTermForm({
          ...VALID_TERM_FORM,
          [prop]: 'a',
        });

        const { [prop]: validationKey } =
          entity.getFormattedValidationErrors()!;

        expect(validationKey).toContain('must be a number.');
      });
    });
  });
});
