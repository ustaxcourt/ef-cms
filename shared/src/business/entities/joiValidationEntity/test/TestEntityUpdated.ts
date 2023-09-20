import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class TestEntityUpdated extends JoiValidationEntity {
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
