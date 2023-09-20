import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class TestEntity extends JoiValidationEntity {
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
