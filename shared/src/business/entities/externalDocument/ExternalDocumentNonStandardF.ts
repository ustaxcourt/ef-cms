import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
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
