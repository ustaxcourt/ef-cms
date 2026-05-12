import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';

export class BarNumberSearchValidation extends JoiValidationEntity {
  public barNumber: string;

  constructor(rawProps: RawBarNumberSearchValidation) {
    super('BarNumberSearchValidation');
    this.barNumber = rawProps.barNumber;
  }

  getValidationRules() {
    return {
      barNumber: JoiValidationConstants.BAR_NUMBER.description(
        'The bar number being searched for',
      )
        .messages({
          '*': 'Enter a valid bar number',
        })
        .required(),
    };
  }
}

export type RawBarNumberSearchValidation =
  ExcludeMethods<BarNumberSearchValidation>;
