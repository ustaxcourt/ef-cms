import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export const TEST_VALIDATION_RULES = joi.object().keys({
  contactType: JoiValidationConstants.STRING.valid(
    'VALID_1',
    'VALID_2',
    'VALID_3',
  ),
});
export class TestCaseEntity extends JoiValidationEntity {
  public contactType: string;
  public caseList: TestCaseEntity[];

  getValidationRules() {
    // TODO: make sure new function supports bubbling eerrors up to parent when
    // defining joi validation using the item() method
    // caseList: joi.array().items(TEST_VALIDATION_RULES).optional().messages({
    //   'any.only': 'invalid contact type',
    // }),

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
    };
  }
  getErrorToMessageMap() {
    return {
      contactType: 'invalid contact type',
    };
  }

  constructor(rawTestCase) {
    super('TestCaseEntity');
    this.contactType = rawTestCase.contactType || 'VALID_1';
    this.caseList = (rawTestCase.caseList || []).map(
      d => new TestCaseEntity(d),
    );
  }
}
