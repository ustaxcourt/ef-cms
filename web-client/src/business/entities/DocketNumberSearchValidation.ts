import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class DocketNumberSearchValidation extends JoiValidationEntity {
  public docketNumber: string;

  constructor(rawProps: any) {
    super('DocketNumberSearchValidation');
    this.docketNumber = rawProps.docketNumber;
  }

  getValidationRules() {
    return {
      docketNumber: JoiValidationConstants.DOCKET_NUMBER_SEARCH.description(
        'Unique case identifier in XXXXX-YY format.',
      )
        .messages({
          '*': 'Enter a valid docket number',
        })
        .required(),
    };
  }
}
