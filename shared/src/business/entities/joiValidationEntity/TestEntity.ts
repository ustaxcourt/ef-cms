import { JoiValidationEntity_New } from './JoiValidationEntity_New';
import joi from 'joi';

export class TestEntity extends JoiValidationEntity_New {
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
        'any.required': 'arrayErrorMessage is required.',
        'string.min': 'arrayErrorMessage must be at least 2 characters long.',
      }),
      propUsingReference: joi
        .number()
        .min(joi.ref('referencedProp'))
        .required()
        .messages({
          'number.min':
            'propUsingReference must be greater than referencedProp.',
        }),
      referencedProp: joi.number().required(),
      singleErrorMessage: joi.string().min(2).required().messages({
        'any.required': 'singleErrorMessage default message.',
        'string.min': 'singleErrorMessage default message.',
      }),
    };
  }
}
