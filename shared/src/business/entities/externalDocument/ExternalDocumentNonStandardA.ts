import { ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class ExternalDocumentNonStandardA extends ExternalDocumentBase {
  public previousDocument: { documentTitle?: string; documentType: string };

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardA');

    this.previousDocument = rawProps.previousDocument;
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
  };

  getValidationRules() {
    return ExternalDocumentNonStandardA.VALIDATION_RULES;
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
  };

  getValidationRules_NEW() {
    return ExternalDocumentNonStandardA.VALIDATION_RULES_NEW;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.previousDocument
        ? this.previousDocument.documentTitle ||
            this.previousDocument.documentType
        : '',
    );
  }
}

export type RawExternalDocumentNonStandardA =
  ExcludeMethods<ExternalDocumentNonStandardA>;
