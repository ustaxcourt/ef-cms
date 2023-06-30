import { ExternalDocumentBase } from './ExternalDocumentBase';
import { ExternalDocumentFactory } from './ExternalDocumentFactory';
import { replaceBracketed } from '../../utilities/replaceBracketed';
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

  getDocumentTitle(): string {
    return replaceBracketed(
      this.documentTitle,
      this.secondaryDocument.getDocumentTitle(),
    );
  }
}

export type RawExternalDocumentNonStandardH =
  ExcludeMethods<ExternalDocumentNonStandardH>;
