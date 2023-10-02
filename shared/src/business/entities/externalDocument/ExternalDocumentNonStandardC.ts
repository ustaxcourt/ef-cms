import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class ExternalDocumentNonStandardC extends ExternalDocumentBase {
  public freeText: string;
  public previousDocument: { documentTitle?: string; documentType: string };

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardC');

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

  getValidationRules() {
    return ExternalDocumentNonStandardC.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    freeText: JoiValidationConstants.STRING.max(1000).required().messages({
      'any.required': 'Provide an answer',
      'string.max': 'Limit is 1000 characters. Enter 1000 or fewer characters.',
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
    return ExternalDocumentNonStandardC.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return {
      ...ExternalDocumentBase.VALIDATION_ERROR_MESSAGES,
      freeText: [
        { contains: 'is required', message: 'Enter name' },
        {
          contains: 'must be less than or equal to',
          message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
        },
      ],
    };
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
