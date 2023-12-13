import { ExcludeMethods } from 'types/TEntity';
import { ExternalDocumentBase } from './ExternalDocumentBase';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import joi from 'joi';

export class ExternalDocumentNonStandardD extends ExternalDocumentBase {
  public previousDocument: { documentTitle?: string; documentType: string };
  public serviceDate: string;

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardD');

    this.previousDocument = rawProps.previousDocument;
    this.serviceDate = rawProps.serviceDate;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    previousDocument: joi
      .object()
      .keys({
        documentTitle: JoiValidationConstants.STRING.optional(),
        documentType: JoiValidationConstants.STRING.required(),
      })
      .required()
      .messages({ '*': 'Select a document' }),
    serviceDate: JoiValidationConstants.ISO_DATE.max('now')
      .required()
      .messages({
        '*': 'Provide a service date',
        'date.max': 'Service date cannot be in the future. Enter a valid date.',
      }),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardD.VALIDATION_RULES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.previousDocument
        ? this.previousDocument.documentTitle ||
            this.previousDocument.documentType
        : '',
      formatDateString(this.serviceDate, FORMATS.MMDDYYYY_DASHED),
    );
  }
}

export type RawExternalDocumentNonStandardD =
  ExcludeMethods<ExternalDocumentNonStandardD>;
