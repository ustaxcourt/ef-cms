import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
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
    ordinalValue: JoiValidationConstants.STRING.required(),
    otherIteration: joi.when('ordinalValue', {
      is: 'Other',
      otherwise: joi.optional().allow(null),
      then: joi.number().max(999).required(),
    }),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardG.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    ordinalValue: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessage('Select an iteration'),
    ),
    otherIteration: joi
      .when('ordinalValue', {
        is: 'Other',
        otherwise: joi.optional().allow(null),
        then: joi.number().max(999).required(),
      })
      .messages({
        ...setDefaultErrorMessage('Maximum iteration value is 999.'),
        'any.required': 'Enter an iteration number.',
      }),
  };

  getValidationRules_NEW() {
    return ExternalDocumentNonStandardG.VALIDATION_RULES_NEW;
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
