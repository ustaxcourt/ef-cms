import { InvalidEntityError } from '@web-api/errors/errors';
import { TestEntity } from './TestEntity';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';

describe('Joi Entity', () => {
  describe('getValidationErrors', () => {
    it('should return null if there are no errors in validation', () => {
      const testEntity = new TestEntity({
        arrayErrorMessage: 'APPROVED',
        propUsingReference: 10,
        singleErrorMessage: 'APPROVED',
      });

      const errors = testEntity.getValidationErrors();

      expect(errors).toEqual(null);
    });

    describe('arrayErrorMessage', () => {
      it('should return correct error message when "arrayErrorMessage" does not meet min length', () => {
        const testEntity = new TestEntity({
          arrayErrorMessage: 'a',
          singleErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.arrayErrorMessage).toEqual(
          'arrayErrorMessage must be at least 2 characters long.',
        );
      });

      it('should return correct error message when "arrayErrorMessage" is not defined', () => {
        const testEntity = new TestEntity({
          singleErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getValidationErrors()!;

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

        const errors = testEntity.getValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.singleErrorMessage).toEqual(
          'singleErrorMessage default message.',
        );
      });

      it('should return default message when "singleErrorMessage" is not defined', () => {
        const testEntity = new TestEntity({
          arrayErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getValidationErrors()!;

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

        const errors = testEntity.getValidationErrors()!;

        expect(Object.keys(errors).length).toEqual(1);
        expect(errors.propUsingReference).toEqual(
          'propUsingReference must be greater than referencedProp.',
        );
      });
    });
  });

  describe('isValid', () => {
    it('should true when the entity does NOT have any validation errors', () => {
      const testEntity = new TestEntity({
        arrayErrorMessage: 'APPROVED',
        propUsingReference: 10,
        singleErrorMessage: 'APPROVED',
      });

      const isValid = testEntity.isValid();

      expect(isValid).toEqual(true);
    });
  });

  describe('validate', () => {
    it('should throw an error and log the entity when logErrors is true and the entity is NOT valid', () => {
      const testEntity = new TestEntity({
        arrayErrorMessage: 'APPROVED',
        propUsingReference: 10,
        singleErrorMessage: '', // Invalid, must be a string with at least 2 characters
      });

      try {
        testEntity.validate({
          applicationContext,
          logErrors: true,
        });
      } catch (e) {
        expect(e instanceof InvalidEntityError).toEqual(true);
        expect(applicationContext?.logger.error).toHaveBeenCalled();
      }
    });
  });
});
