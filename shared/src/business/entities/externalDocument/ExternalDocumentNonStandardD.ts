import { ExternalDocument, ExternalDocumentBase } from './ExternalDocumentBase';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import joi from 'joi';

export class ExternalDocumentNonStandardD extends ExternalDocument {
  public previousDocument: any;
  public serviceDate: any;

  constructor(rawProps) {
    super('ExternalDocumentNonStandardD');

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
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
      .required(),
    serviceDate: JoiValidationConstants.ISO_DATE.max('now').required(),
  };

  static VALIDATION_ERROR_MESSAGES =
    ExternalDocumentBase.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return ExternalDocumentNonStandardD.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ExternalDocumentNonStandardD.VALIDATION_ERROR_MESSAGES;
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
