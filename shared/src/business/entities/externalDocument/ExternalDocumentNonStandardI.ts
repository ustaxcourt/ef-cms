import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import { transformFormValueToTitleCaseOrdinal } from '../../utilities/transformFormValueToTitleCaseOrdinal';
import joi from 'joi';

export class ExternalDocumentNonStandardI extends ExternalDocumentBase {
  public freeText: string;
  public ordinalValue: string;
  public otherIteration?: number;

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardI');

    this.freeText = rawProps.freeText;
    this.ordinalValue = rawProps.ordinalValue;
    this.otherIteration = rawProps.otherIteration;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).required(),
    ordinalValue: JoiValidationConstants.STRING.required(),
    otherIteration: joi.when('ordinalValue', {
      is: 'Other',
      otherwise: joi.optional().allow(null),
      then: joi.number().max(999).required(),
    }),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardI.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    freeText: JoiValidationConstants.STRING.max(1000).required().messages({
      'any.required': 'Provide an answer',
      'string.max': 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    }),
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
    return ExternalDocumentNonStandardI.VALIDATION_RULES_NEW;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.ordinalValue === 'Other'
        ? transformFormValueToTitleCaseOrdinal(this.otherIteration)
        : transformFormValueToTitleCaseOrdinal(this.ordinalValue),
      this.freeText,
    );
  }
}

export type RawExternalDocumentNonStandardI =
  ExcludeMethods<ExternalDocumentNonStandardI>;
