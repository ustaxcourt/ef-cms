import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class TestCaseEntity extends JoiValidationEntity {
  public contactType: string;
  public caseList: TestCaseEntity[];

  getValidationRules() {
    return {
      contactType: JoiValidationConstants.STRING.valid(
        'VALID_1',
        'VALID_2',
        'VALID_3',
      )
        .required()
        .messages({
          'any.only': 'contantType does not match any of the allowed types',
        }),
    };
  }
  getErrorToMessageMap() {
    return {
      contactType: 'contantType does not match any of the allowed types',
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
