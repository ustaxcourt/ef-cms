import { ExternalDocumentBase } from './ExternalDocumentBase';
import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class ExternalDocumentNonStandardH extends ExternalDocumentBase {
  public secondaryDocument: any;

  constructor(rawProps) {
    super(rawProps, 'ExternalDocumentNonStandardH');

    this.secondaryDocument = ExternalDocumentFactory(
      rawProps.secondaryDocument || {},
    );
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    secondaryDocument: joi.object().required(),
    secondaryDocumentFile: joi.object().optional(),
  };

  getValidationRules() {
    return ExternalDocumentNonStandardH.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...ExternalDocumentBase.VALIDATION_RULES_NEW,
    secondaryDocument: joi
      .object()
      .required()
      .messages(setDefaultErrorMessages('Select a document')),
    secondaryDocumentFile: joi
      .object()
      .optional()
      .messages(setDefaultErrorMessages('Upload a document')),
  };

  getValidationRules_NEW() {
    return ExternalDocumentNonStandardH.VALIDATION_RULES_NEW;
  }

  john() {
    console.log('NEW getValidationRules_NEW H TYPE');
    return ExternalDocumentNonStandardH.VALIDATION_RULES_NEW;
  }

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.secondaryDocument.getDocumentTitle(),
    );
  }
}

export type RawExternalDocumentNonStandardH =
  ExcludeMethods<ExternalDocumentNonStandardH>;
