import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity_New } from '@shared/business/entities/joiValidationEntity/JoiValidationEntity_New';
import joi from 'joi';

export const TEST_VALIDATION_RULES = joi.object().keys({
  contactType: JoiValidationConstants.STRING.valid(
    'VALID_1',
    'VALID_2',
    'VALID_3',
  ),
});
export class TestCaseEntity extends JoiValidationEntity_New {
  public contactType: string;
  public caseList: TestCaseEntity[];
  public unhelpfulErrorMessage: string;
  public nestedCase: TestCaseEntity | undefined;

  getValidationRules() {
    return {
      caseList: joi.array().items(TEST_VALIDATION_RULES).optional().messages({
        'any.only': 'invalid contact type',
      }),
      contactType: JoiValidationConstants.STRING.valid(
        'VALID_1',
        'VALID_2',
        'VALID_3',
      )
        .required()
        .messages({
          'any.only': 'invalid contact type',
        }),
      unhelpfulErrorMessage: JoiValidationConstants.STRING.valid(
        'VALID_1',
        'VALID_2',
        'VALID_3',
      )
        .optional()
        .messages({
          'any.only':
            'unhelpfulErrorMessage: does not match any of the allowed types',
        }),
    };
  }

  constructor(rawTestCase) {
    super('TestCaseEntity');
    this.contactType = rawTestCase.contactType || 'VALID_1';
    this.caseList = (rawTestCase.caseList || []).map(
      d => new TestCaseEntity(d),
    );
    this.unhelpfulErrorMessage = rawTestCase.unhelpfulErrorMessage;
    this.nestedCase = rawTestCase.nestedCase
      ? new TestCaseEntity(rawTestCase.nestedCase)
      : undefined;
  }
}
