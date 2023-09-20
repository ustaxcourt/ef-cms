import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

describe('Joi Entity', () => {
  class TestEntity extends JoiValidationEntity {
    public arrayErrorMessage: string;
    public singleErrorMessage: string;

    public referencedProp: number = 5;
    public propUsingReference: number;

    constructor(rawData: any) {
      super('TestEntity');
      this.arrayErrorMessage = rawData.arrayErrorMessage;
      this.singleErrorMessage = rawData.singleErrorMessage;
      this.propUsingReference = rawData.propUsingReference || 10;
    }

    getValidationRules() {
      return {
        arrayErrorMessage: joi.string().min(2).required(),
        propUsingReference: joi
          .number()
          .min(joi.ref('referencedProp'))
          .required(),
        referencedProp: joi.number().required(),
        singleErrorMessage: joi.string().min(2).required(),
      };
    }

    getErrorToMessageMap() {
      return {
        arrayErrorMessage: [
          {
            contains: 'is required',
            message: 'LEGACY_CUSTOM arrayErrorMessage is required.',
          },
          {
            contains: 'length must be at least',
            message:
              'LEGACY_CUSTOM arrayErrorMessage must be at least 2 characters long.',
          },
        ],
        propUsingReference: [
          {
            contains: 'ref:referencedProp',
            message:
              'LEGACY_CUSTOM propUsingReference must be grater than referencedProp.',
          },
        ],
        singleErrorMessage: 'LEGACY_CUSTOM singleErrorMessage default message.',
      };
    }
  }

  class TestEntityUpdated extends JoiValidationEntity {
    public arrayErrorMessage: string;
    public singleErrorMessage: string;

    public referencedProp: number = 5;
    public propUsingReference: number;

    constructor(rawData: any) {
      super('TestEntity');
      this.arrayErrorMessage = rawData.arrayErrorMessage;
      this.singleErrorMessage = rawData.singleErrorMessage;
      this.propUsingReference = rawData.propUsingReference || 10;
    }

    getValidationRules() {
      return {
        arrayErrorMessage: joi.string().min(2).required().messages({
          'any.required': 'NEW_CUSTOM arrayErrorMessage is required.',
          'string.min':
            'NEW_CUSTOM arrayErrorMessage must be at least 2 characters long.',
        }),
        propUsingReference: joi
          .number()
          .min(joi.ref('referencedProp'))
          .required()
          .messages({
            'number.min':
              'NEW_CUSTOM propUsingReference must be grater than referencedProp.',
          }),
        referencedProp: joi.number().required(),
        singleErrorMessage: joi.string().min(2).required().messages({
          'any.required': 'NEW_CUSTOM singleErrorMessage default message.',
          'string.min': 'NEW_CUSTOM singleErrorMessage default message.',
        }),
      };
    }

    getErrorToMessageMap() {
      return {};
    }
  }

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
