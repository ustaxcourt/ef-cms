import { ExternalDocument, ExternalDocumentBase } from './ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';

export class ExternalDocumentNonStandardB extends ExternalDocument {
  public freeText: any;

  constructor(rawProps) {
    super('ExternalDocumentNonStandardB');

    this.category = rawProps.category;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.freeText = rawProps.freeText;
  }

  static VALIDATION_RULES = {
    ...ExternalDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).required(),
  };

  static VALIDATION_ERROR_MESSAGES =
    ExternalDocumentBase.VALIDATION_ERROR_MESSAGES;

  getValidationRules() {
    return ExternalDocumentNonStandardB.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES;
  }

  getDocumentTitle(): string {
    return replaceBracketed(this.documentTitle, this.freeText);
  }
}

export type RawExternalDocumentNonStandardB =
  ExcludeMethods<ExternalDocumentNonStandardB>;
