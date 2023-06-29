import { ExternalDocument, ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { transformFormValueToTitleCaseOrdinal } from '../../utilities/transformFormValueToTitleCaseOrdinal';
import joi from 'joi';

export class ExternalDocumentNonStandardI extends ExternalDocument {
  public freeText: any;
  public ordinalValue: any;
  public otherIteration: any;

  constructor(rawProps) {
    super('ExternalDocumentNonStandardI');

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
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

  static VALIDATION_ERROR_MESSAGES =
    ExternalDocumentBase.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return ExternalDocumentNonStandardI.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ExternalDocumentNonStandardI.VALIDATION_ERROR_MESSAGES;
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
