import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import { transformFormValueToTitleCaseOrdinal } from '../../utilities/transformFormValueToTitleCaseOrdinal';
import joi from 'joi';

export class ExternalDocumentNonStandardF extends ExternalDocumentBase {
  public ordinalValue: string;
  public otherIteration?: number;
  public previousDocument: { documentTitle?: string; documentType: string };

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardF');

    this.ordinalValue = rawProps.ordinalValue;
    this.otherIteration = rawProps.otherIteration;
    this.previousDocument = rawProps.previousDocument;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    ordinalValue: JoiValidationConstants.STRING.required(),
    otherIteration: joi.when('ordinalValue', {
      is: 'Other',
      otherwise: joi.optional().allow(null),
      then: joi.number().max(999).required(),
    }),
    previousDocument: joi
      .object()
      .keys({
        documentTitle: JoiValidationConstants.STRING.optional(),
        documentType: JoiValidationConstants.STRING.required(),
      })
      .required(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardF.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    ordinalValue: JoiValidationConstants.STRING.required().messages(
      setDefaultErrorMessages('Select an iteration'),
    ),
    otherIteration: joi
      .when('ordinalValue', {
        is: 'Other',
        otherwise: joi.optional().allow(null),
        then: joi.number().max(999).required(),
      })
      .messages({
        ...setDefaultErrorMessages('Maximum iteration value is 999.'),
        'any.required': 'Enter an iteration number.',
      }),
    previousDocument: joi
      .object()
      .keys({
        documentTitle: JoiValidationConstants.STRING.optional(),
        documentType: JoiValidationConstants.STRING.required(),
      })
      .required()
      .messages(setDefaultErrorMessages('Select a document')),
  };

  getValidationRules_NEW() {
    return ExternalDocumentNonStandardF.VALIDATION_RULES_NEW;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.ordinalValue === 'Other'
        ? transformFormValueToTitleCaseOrdinal(this.otherIteration)
        : transformFormValueToTitleCaseOrdinal(this.ordinalValue),
      this.previousDocument
        ? this.previousDocument.documentTitle ||
            this.previousDocument.documentType
        : '',
    );
  }
}

export type RawExternalDocumentNonStandardF =
  ExcludeMethods<ExternalDocumentNonStandardF>;
