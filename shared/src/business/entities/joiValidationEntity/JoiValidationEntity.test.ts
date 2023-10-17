import { TestCaseEntity } from '@shared/business/entities/joiValidationEntity/test/TestCaseEntity';
import { TestEntity } from '@shared/business/entities/joiValidationEntity/test/TestEntity';

describe('Joi Entity', () => {
  describe('getFormattedValidationErrors', () => {
    it('should return null if there are no errors in validation', () => {
      const testEntity = new TestEntity({
        arrayErrorMessage: 'APPROVED',
        propUsingReference: 10,
        singleErrorMessage: 'APPROVED',
      });

      const errors = testEntity.getFormattedValidationErrors();

      expect(errors).toEqual(null);
    });

    describe('arrayErrorMessage', () => {
      it('should return correct error message when "arrayErrorMessage" does not meet min length', () => {
        const testEntity = new TestEntity({
          arrayErrorMessage: 'a',
          singleErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getFormattedValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.arrayErrorMessage).toEqual(
          'arrayErrorMessage must be at least 2 characters long.',
        );
      });

      it('should return correct error message when "arrayErrorMessage" is not defined', () => {
        const testEntity = new TestEntity({
          singleErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getFormattedValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.arrayErrorMessage).toEqual(
          'arrayErrorMessage is required.',
        );
      });
    });

    describe('singleErrorMessage', () => {
      it('should return default message when "singleErrorMessage" does not meet min length', () => {
        const testEntity = new TestEntity({
          arrayErrorMessage: 'APPROVED',
          singleErrorMessage: 'a',
        });

        const errors = testEntity.getFormattedValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.singleErrorMessage).toEqual(
          'singleErrorMessage default message.',
        );
      });

      it('should return default message when "singleErrorMessage" is not defined', () => {
        const testEntity = new TestEntity({
          arrayErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getFormattedValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.singleErrorMessage).toEqual(
          'singleErrorMessage default message.',
        );
      });
    });

    describe('references', () => {
      it('should display correct error message when using joi.ref correctly', () => {
        const testEntity = new TestEntity({
          arrayErrorMessage: 'APPROVED',
          propUsingReference: 4,
          singleErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getFormattedValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.propUsingReference).toEqual(
          'propUsingReference must be grater than referencedProp.',
        );
      });
    });

    describe('remove unhelpful error messages from contact validations', () => {
      it('should remove unhelpful error messages that end with "does not match any of the allowed types"', () => {
        const testCaseEntity = new TestCaseEntity({
          unhelpfulErrorMessage: 'INVALID',
        });

        const errors = testCaseEntity.getFormattedValidationErrors()!;
        expect(errors).toEqual(null);
      });
    });

    describe('nested entities', () => {
      it('should return an array of errors when there is an error in a nested entity list', () => {
        const testCaseEntity = new TestCaseEntity({
          caseList: [
            { contactType: 'VALID_1' },
            { contactType: 'INVALID' },
            { contactType: 'VALID_1' },
          ],
        });

        const errors = testCaseEntity.getFormattedValidationErrors();

        expect(errors).toEqual({
          caseList: [
            {
              contactType: 'invalid contact type',
              index: 1,
            },
          ],
          contactType: 'invalid contact type',
        });
      });

      it('should return an object of errors when there is an error in a nested entity', () => {
        const testCaseEntity = new TestCaseEntity({
          nestedCase: { contactType: 'INVALID_1' },
        });

        const errors = testCaseEntity.getFormattedValidationErrors();

        expect(errors).toEqual({
          nestedCase: {
            contactType: 'invalid contact type',
          },
        });
      });
    });
  });
});
