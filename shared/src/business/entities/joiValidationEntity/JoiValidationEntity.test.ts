import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { TestEntity } from '@shared/business/entities/joiValidationEntity/test/TestEntity';
import { TestEntityUpdated } from '@shared/business/entities/joiValidationEntity/test/TestEntityUpdated';

describe('Joi Entity', () => {
  describe('getFormattedValidationErrors', () => {
    describe('LEGACY IMPLEMENTATION', () => {
      it('should return null if there are no errors in validation', () => {
        const testEntity = new TestEntity({
          arrayErrorMessage: 'APPROVED',
          propUsingReference: 10,
          singleErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getFormattedValidationErrors()!;

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
            'LEGACY_CUSTOM arrayErrorMessage must be at least 2 characters long.',
          );
        });

        it('should return correct error message when "arrayErrorMessage" is not defined', () => {
          const testEntity = new TestEntity({
            singleErrorMessage: 'APPROVED',
          });

          const errors = testEntity.getFormattedValidationErrors()!;

          expect(Object.keys(errors).length).toEqual(1);
          expect(errors.arrayErrorMessage).toEqual(
            'LEGACY_CUSTOM arrayErrorMessage is required.',
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
            'LEGACY_CUSTOM singleErrorMessage default message.',
          );
        });

        it('should return default message when "singleErrorMessage" is not defined', () => {
          const testEntity = new TestEntity({
            arrayErrorMessage: 'APPROVED',
          });

          const errors = testEntity.getFormattedValidationErrors()!;

          expect(Object.keys(errors).length).toEqual(1);
          expect(errors.singleErrorMessage).toEqual(
            'LEGACY_CUSTOM singleErrorMessage default message.',
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
            'LEGACY_CUSTOM propUsingReference must be grater than referencedProp.',
          );
        });
      });

      describe('remove unhelpful error messages from contact validations', () => {
        class TestCaseEntity extends JoiValidationEntity {
          public contactType: string;
          getValidationRules() {
            return {
              contactType: JoiValidationConstants.STRING.valid(
                'VALID_1',
                'VALID_2',
                'VALID_3',
              ).required(),
            };
          }
          getErrorToMessageMap() {
            return {
              contactType:
                'contantType does not match any of the allowed types',
            };
          }

          constructor(rawTestCase) {
            super('TestCaseEntity');
            this.contactType = rawTestCase.contactType;
          }
        }

        it('should remove unhelpful error messages that end with "does not match any of the allowed types"', () => {
          const testCaseEntity = new TestCaseEntity({ contactType: 'INVALID' });

          const errors = testCaseEntity.getFormattedValidationErrors()!;
          expect(errors).toEqual(null);
        });
      });
    });

    describe('NEW IMPLEMENTATION', () => {
      it('should return null if there are no errors in validation', () => {
        const testEntity = new TestEntityUpdated({
          arrayErrorMessage: 'APPROVED',
          propUsingReference: 10,
          singleErrorMessage: 'APPROVED',
        });

        const errors = testEntity.getFormattedValidationErrors_NEW()!;

        expect(errors).toEqual(null);
      });

      describe('arrayErrorMessage', () => {
        it('should return correct error message when "arrayErrorMessage" does not meet min length', () => {
          const testEntity = new TestEntityUpdated({
            arrayErrorMessage: 'a',
            singleErrorMessage: 'APPROVED',
          });

          const errors = testEntity.getFormattedValidationErrors_NEW()!;

          expect(Object.keys(errors).length).toEqual(1);
          expect(errors.arrayErrorMessage).toEqual(
            'NEW_CUSTOM arrayErrorMessage must be at least 2 characters long.',
          );
        });

        it('should return correct error message when "arrayErrorMessage" is not defined', () => {
          const testEntity = new TestEntityUpdated({
            singleErrorMessage: 'APPROVED',
          });

          const errors = testEntity.getFormattedValidationErrors_NEW()!;

          expect(Object.keys(errors).length).toEqual(1);
          expect(errors.arrayErrorMessage).toEqual(
            'NEW_CUSTOM arrayErrorMessage is required.',
          );
        });
      });

      describe('singleErrorMessage', () => {
        it('should return default message when "singleErrorMessage" does not meet min length', () => {
          const testEntity = new TestEntityUpdated({
            arrayErrorMessage: 'APPROVED',
            singleErrorMessage: 'a',
          });

          const errors = testEntity.getFormattedValidationErrors_NEW()!;

          expect(Object.keys(errors).length).toEqual(1);
          expect(errors.singleErrorMessage).toEqual(
            'NEW_CUSTOM singleErrorMessage default message.',
          );
        });

        it('should return default message when "singleErrorMessage" is not defined', () => {
          const testEntity = new TestEntityUpdated({
            arrayErrorMessage: 'APPROVED',
          });

          const errors = testEntity.getFormattedValidationErrors_NEW()!;

          expect(Object.keys(errors).length).toEqual(1);
          expect(errors.singleErrorMessage).toEqual(
            'NEW_CUSTOM singleErrorMessage default message.',
          );
        });
      });

      describe('references', () => {
        it('should display correct error message when using joi.ref correctly', () => {
          const testEntity = new TestEntityUpdated({
            arrayErrorMessage: 'APPROVED',
            propUsingReference: 4,
            singleErrorMessage: 'APPROVED',
          });

          const errors = testEntity.getFormattedValidationErrors_NEW()!;

          expect(Object.keys(errors).length).toEqual(1);
          expect(errors.propUsingReference).toEqual(
            'NEW_CUSTOM propUsingReference must be grater than referencedProp.',
          );
        });
      });
    });
  });
});
