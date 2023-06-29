import { ExternalDocument, ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import joi from 'joi';

export class ExternalDocumentNonStandardC extends ExternalDocument {
  public freeText: any;
  public previousDocument: any;

  constructor(rawProps) {
    super('ExternalDocumentNonStandardC');

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.freeText = rawProps.freeText;
    this.previousDocument = rawProps.previousDocument;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).required(),
    previousDocument: joi
      .object()
      .keys({
        documentTitle: JoiValidationConstants.STRING.optional(),
        documentType: JoiValidationConstants.STRING.required(),
      })
      .required(),
  };

  static VALIDATION_ERROR_MESSAGES = {
    ...ExternalDocumentBase.VALIDATION_ERROR_MESSAGES,
    freeText: [
      { contains: 'is required', message: 'Enter name' },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
      },
    ],
  };

  getValidationRules() {
    return ExternalDocumentNonStandardC.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ExternalDocumentNonStandardC.VALIDATION_ERROR_MESSAGES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.freeText,
      this.previousDocument
        ? this.previousDocument.documentTitle ||
            this.previousDocument.documentType
        : '',
    );
  }
}

export type RawExternalDocumentNonStandardC =
  ExcludeMethods<ExternalDocumentNonStandardC>;
