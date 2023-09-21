import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class TestCaseEntity extends JoiValidationEntity {
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
      contactType: 'contantType does not match any of the allowed types',
    };
  }

  constructor(rawTestCase) {
    super('TestCaseEntity');
    this.contactType = rawTestCase.contactType;
  }
}
