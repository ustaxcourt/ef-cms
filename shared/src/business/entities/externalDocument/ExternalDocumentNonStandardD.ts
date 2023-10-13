import { ExternalDocumentBase } from './ExternalDocumentBase';
import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
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
      .required(),
    serviceDate: JoiValidationConstants.ISO_DATE.max('now').required(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardD.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    previousDocument: joi
      .object()
      .keys({
        documentTitle: JoiValidationConstants.STRING.optional(),
        documentType: JoiValidationConstants.STRING.required(),
      })
      .required()
      .messages(setDefaultErrorMessage('Select a document')),
    serviceDate: JoiValidationConstants.ISO_DATE.max('now')
      .required()
      .messages({
        ...setDefaultErrorMessage('Provide a service date'),
        'date.max': 'Service date cannot be in the future. Enter a valid date.',
      }),
  };

  getValidationRules_NEW() {
    return ExternalDocumentNonStandardD.VALIDATION_RULES_NEW;
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
