import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { transformFormValueToTitleCaseOrdinal } from '../../utilities/transformFormValueToTitleCaseOrdinal';
import joi from 'joi';

export class ExternalDocumentNonStandardG extends ExternalDocumentBase {
  public ordinalValue: string;
  public otherIteration?: number;

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardG');

    this.ordinalValue = rawProps.ordinalValue;
    this.otherIteration = rawProps.otherIteration;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    ordinalValue: JoiValidationConstants.STRING.required().messages({
      '*': 'Select an iteration',
    }),
    otherIteration: joi
      .when('ordinalValue', {
        is: 'Other',
        otherwise: joi.optional().allow(null),
        then: joi.number().max(999).required(),
      })
      .messages({
        '*': 'Maximum iteration value is 999.',
        'any.required': 'Enter an iteration number.',
      }),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardG.VALIDATION_RULES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.ordinalValue === 'Other'
        ? transformFormValueToTitleCaseOrdinal(this.otherIteration)
        : transformFormValueToTitleCaseOrdinal(this.ordinalValue),
      this.documentType,
    );
  }
}

export type RawExternalDocumentNonStandardG =
  ExcludeMethods<ExternalDocumentNonStandardG>;
